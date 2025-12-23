const { supabaseAdmin } = require('../../../lib/supabase');
const { verifyAuth } = require('../../../lib/auth');
const formidable = require('formidable');
const fs = require('fs');

// Fix for formidable v3+
const IncomingForm = formidable.IncomingForm || formidable.formidable || formidable;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const { authenticated, user } = await verifyAuth(req);

    if (!authenticated) {
      return res.status(401).json({ 
        success: false, 
        error: 'Not authenticated' 
      });
    }

    const form = new IncomingForm({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const folder = Array.isArray(fields.folder) ? fields.folder[0] : (fields.folder || 'general');
    const altText = Array.isArray(fields.alt_text) ? fields.alt_text[0] : fields.alt_text;
    const caption = Array.isArray(fields.caption) ? fields.caption[0] : fields.caption;
    
    const file = files.file ? (Array.isArray(files.file) ? files.file[0] : files.file) : null;
    
    if (!file || file.size === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid file type. Only images allowed.' 
        });
    }

    // Read file
    const fileBuffer = fs.readFileSync(file.filepath);
    const fileName = `${Date.now()}-${file.originalFilename || file.newFilename}`;
    
    // Determine bucket based on folder
    let bucket = 'website';
    if (folder === 'products' || folder.startsWith('product')) {
      bucket = 'products';
    } else if (folder === 'news' || folder.startsWith('news')) {
      bucket = 'news';
    }

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from(bucket)
      .upload(`${folder}/${fileName}`, fileBuffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error('❌ Supabase upload error:', uploadError);
      console.error('Error details:', JSON.stringify(uploadError, null, 2));
      console.error('Bucket:', bucket);
      console.error('Path:', `${folder}/${fileName}`);
      fs.unlinkSync(file.filepath);
      return res.status(500).json({ 
        success: false, 
        error: `Upload to storage failed: ${uploadError.message || 'Unknown error'}`,
        details: uploadError.message
      });
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from(bucket)
      .getPublicUrl(`${folder}/${fileName}`);

    // Save to media library
    const { data: mediaData, error: mediaError } = await supabaseAdmin
      .from('media_library')
      .insert([
        {
          file_name: file.originalFilename || file.newFilename,
          file_path: uploadData.path,
          file_size: file.size,
          file_type: file.mimetype,
          mime_type: file.mimetype,
          folder,
          alt_text: altText,
          caption: caption,
          uploaded_by: user.id
        }
      ])
      .select()
      .single();

    if (mediaError) {
      console.error('Error saving to media library:', mediaError);
    }

    // Clean up temp file
    fs.unlinkSync(file.filepath);

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: mediaData?.id,
        file_path: uploadData.path,
        public_url: publicUrl,
        file_name: file.originalFilename || file.newFilename,
        file_size: file.size,
        mime_type: file.mimetype,
        bucket,
        folder
      },
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message,
      details: error.toString()
    });
  }
}

