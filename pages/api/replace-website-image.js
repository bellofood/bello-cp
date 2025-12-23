const { supabaseAdmin } = require('../../lib/supabase');
const { verifyAuth } = require('../../lib/auth');
const formidable = require('formidable');
const fs = require('fs');

const IncomingForm = formidable.IncomingForm || formidable.formidable || formidable;

export const config = {
  api: {
    bodyParser: false,
  },
};

// Map of image IDs to their Supabase storage info
const IMAGE_CONFIG = {
  // Hero Section
  'hero-1': { bucket: 'website', folder: 'hero', filename: 'hero_two-slider-1.jpg' },
  'hero-2': { bucket: 'website', folder: 'hero', filename: 'hero_two-slider-2.jpg' },
  'hero-3': { bucket: 'website', folder: 'hero', filename: 'hero_two-slider-3.jpg' },
  
  // Skills Section
  'skill-4': { bucket: 'website', folder: 'skill', filename: 'skill-4.png' },
  'skill-5': { bucket: 'website', folder: 'skill', filename: 'skill-5.png' },
  
  // About Section
  'about-1': { bucket: 'website', folder: 'about', filename: 'about-1.jpg' },
  'about-3': { bucket: 'website', folder: 'about', filename: 'about-3.jpg' },
  'about-4': { bucket: 'website', folder: 'about', filename: 'about-4.jpg' },
  'about-5': { bucket: 'website', folder: 'about', filename: 'about-5.jpg' },
  
  // Sustainability Page
  'sustainability-1': { bucket: 'website', folder: 'sustainability', filename: 'sus 1.jpg' },
  'sustainability-2': { bucket: 'website', folder: 'sustainability', filename: 'sus 2.jpg' },
  'sustainability-3': { bucket: 'website', folder: 'sustainability', filename: 'sus 3.jpg' },
  'sustainability-4': { bucket: 'website', folder: 'sustainability', filename: 'sus 4.png' },
  
  // Gallery Section
  'gallery-cta-1': { bucket: 'website', folder: 'gallery', filename: 'cta-1.jpg' },
  'gallery-widget-1': { bucket: 'website', folder: 'gallery', filename: 'thumb-widget-1.jpg' },
  'gallery-widget-2': { bucket: 'website', folder: 'gallery', filename: 'thumb-widget-2.png' },
  'gallery-widget-3': { bucket: 'website', folder: 'gallery', filename: 'thumb-widget-3.png' },
  'gallery-widget-4': { bucket: 'website', folder: 'gallery', filename: 'thumb-widget-4.png' },
  'gallery-widget-5': { bucket: 'website', folder: 'gallery', filename: 'thumb-widget-5.png' },
  'gallery-widget-6': { bucket: 'website', folder: 'gallery', filename: 'thumb-widget-6.png' },
  
  // Background Images
  'bg-about': { bucket: 'website', folder: 'bg', filename: 'about-bg-1.jpg' },
  'bg-page': { bucket: 'website', folder: 'bg', filename: 'page-bg-1.jpg' },
  'bg-features': { bucket: 'website', folder: 'bg', filename: 'features-bg-1.jpg' },
  
  // Product Categories
  'category-all': { bucket: 'website', folder: 'categories', filename: 'category-all-products.png' },
  'category-green-olives': { bucket: 'website', folder: 'categories', filename: 'category-green-olives.png' },
  'category-black-olives': { bucket: 'website', folder: 'categories', filename: 'category-black-olives.png' },
  'category-peppers': { bucket: 'website', folder: 'categories', filename: 'category-peppers.png' },
  'category-pickles': { bucket: 'website', folder: 'categories', filename: 'category-pickles.png' },
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

    const targetImage = Array.isArray(fields.targetImage) ? fields.targetImage[0] : fields.targetImage;
    const file = files.file ? (Array.isArray(files.file) ? files.file[0] : files.file) : null;
    
    if (!file || file.size === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    if (!targetImage || !IMAGE_CONFIG[targetImage]) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid target image' 
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.mimetype)) {
      fs.unlinkSync(file.filepath);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid file type. Only images allowed.' 
      });
    }

    // Get image configuration
    const config = IMAGE_CONFIG[targetImage];
    const storagePath = `${config.folder}/${config.filename}`;
    
    console.log('\n🔄 REPLACING IMAGE IN SUPABASE:');
    console.log('   Bucket:', config.bucket);
    console.log('   Path:', storagePath);
    console.log('   Size:', file.size, 'bytes');
    
    // Read the uploaded file
    const fileBuffer = fs.readFileSync(file.filepath);
    
    // Upload to Supabase Storage (replace existing)
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from(config.bucket)
      .upload(storagePath, fileBuffer, {
        contentType: file.mimetype,
        upsert: true, // This will replace the existing file
        cacheControl: 'public, max-age=60', // Short CDN cache: 60 seconds for quick updates
      });

    if (uploadError) {
      console.error('❌ Supabase upload error:', uploadError);
      fs.unlinkSync(file.filepath);
      return res.status(500).json({ 
        success: false, 
        error: `Upload failed: ${uploadError.message}`,
        details: uploadError.message
      });
    }
    
    console.log('   ✅ File uploaded successfully!');
    
    // CRITICAL: Force Supabase CDN to purge cache by downloading the file
    // This makes Supabase refresh its CDN immediately instead of waiting
    try {
      await supabaseAdmin
        .storage
        .from(config.bucket)
        .download(storagePath);
      console.log('   ✅ CDN cache purged (forced refresh)');
    } catch (purgeError) {
      console.warn('   ⚠️ Could not purge CDN cache:', purgeError.message);
      // Continue anyway - not critical
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from(config.bucket)
      .getPublicUrl(storagePath);

    console.log('   ✅ Public URL:', publicUrl);
    
    // Clean up temp file
    fs.unlinkSync(file.filepath);
    
    return res.status(200).json({
      success: true,
      message: 'Image replaced successfully in Supabase Storage!',
      data: {
        imageId: targetImage,
        path: storagePath,
        publicUrl: publicUrl,
        size: file.size,
        bucket: config.bucket
      },
    });
    
  } catch (error) {
    console.error('❌ Replace error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message,
      details: error.toString()
    });
  }
}

