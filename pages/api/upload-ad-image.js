import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
const { supabaseAdmin } = require('../../lib/supabase');

const supabase = supabaseAdmin;

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
    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'banners');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    // Promisify form.parse to properly handle errors
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const file = files.adImage;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // Get the first file if it's an array
    const uploadedFile = Array.isArray(file) ? file[0] : file;

    try {
      // Read the file
      const fileBuffer = fs.readFileSync(uploadedFile.filepath);
      // Use "promo" instead of "ad" to avoid ad blockers
      const fileName = `promo-${Date.now()}${path.extname(uploadedFile.originalFilename || uploadedFile.newFilename)}`;

      console.log('📤 Uploading ad image:');
      console.log('   File size:', uploadedFile.size, 'bytes');
      console.log('   Mime type:', uploadedFile.mimetype);
      console.log('   Bucket: website');
      console.log('   Path: banners/' + fileName);

      // Upload to Supabase Storage (use "banners" folder instead of "ads")
      const { data, error: uploadError } = await supabase.storage
        .from('website')
        .upload(`banners/${fileName}`, fileBuffer, {
          contentType: uploadedFile.mimetype,
          upsert: true,
          cacheControl: '3600'
        });

      // Clean up temp file
      if (fs.existsSync(uploadedFile.filepath)) {
        fs.unlinkSync(uploadedFile.filepath);
      }

      if (uploadError) {
        console.error('❌ Supabase upload error:', uploadError);
        console.error('Error details:', JSON.stringify(uploadError, null, 2));
        return res.status(500).json({ success: false, error: 'Failed to upload to storage', details: uploadError.message });
      }

      console.log('✅ Upload successful!');

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('website')
        .getPublicUrl(`banners/${fileName}`);

      const publicUrl = urlData.publicUrl;

      // Update site settings with new ad image
      const { data: existingData, error: selectError } = await supabase
        .from('site_settings')
        .select('id')
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Database select error:', selectError);
        return res.status(500).json({ success: false, error: 'Database error', details: selectError.message });
      }

      if (existingData) {
        const { error: updateError } = await supabase
          .from('site_settings')
          .update({ ad_image: publicUrl, updated_at: new Date().toISOString() })
          .eq('id', existingData.id);

        if (updateError) {
          console.error('Database update error:', updateError);
          return res.status(500).json({ success: false, error: 'Failed to update database', details: updateError.message });
        }
      } else {
        const { error: insertError } = await supabase
          .from('site_settings')
          .insert({ ad_image: publicUrl });

        if (insertError) {
          console.error('Database insert error:', insertError);
          return res.status(500).json({ success: false, error: 'Failed to insert to database', details: insertError.message });
        }
      }

      res.status(200).json({
        success: true,
        message: 'Ad image uploaded successfully',
        imageUrl: publicUrl
      });
    } catch (error) {
      console.error('File processing error:', error);
      // Clean up temp file if it exists
      if (uploadedFile && uploadedFile.filepath && fs.existsSync(uploadedFile.filepath)) {
        fs.unlinkSync(uploadedFile.filepath);
      }
      res.status(500).json({ success: false, error: 'Failed to process file', details: error.message });
    }
  } catch (error) {
    console.error('Upload handler error:', error);
    res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}

