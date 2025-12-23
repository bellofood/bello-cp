import { supabaseAdmin } from '../../../lib/supabase';

// Default image paths (fallback to local files)
const DEFAULT_IMAGES = {
  'hero-1': '/assets/images/hero/hero_two-slider-1.jpg',
  'hero-2': '/assets/images/hero/hero_two-slider-2.jpg',
  'hero-3': '/assets/images/hero/hero_two-slider-3.jpg',
  'skill-4': '/assets/images/skill/skill-4.png',
  'skill-5': '/assets/images/skill/skill-5.png',
  'about-1': '/assets/images/about/about-1.jpg',
  'about-3': '/assets/images/about/about-3.jpg',
  'about-4': '/assets/images/about/about-4.jpg',
  'about-5': '/assets/images/about/about-5.jpg',
  'sustainability-1': '/assets/images/Sustainability/sus 1.jpg',
  'sustainability-2': '/assets/images/Sustainability/sus 2.jpg',
  'sustainability-3': '/assets/images/Sustainability/sus 3.jpg',
  'sustainability-4': '/assets/images/Sustainability/sus 4.png',
  'gallery-cta-1': '/assets/images/gallery/cta-1.jpg',
  'gallery-widget-1': '/assets/images/gallery/thumb-widget-1.jpg',
  'gallery-widget-2': '/assets/images/gallery/thumb-widget-2.png',
  'gallery-widget-3': '/assets/images/gallery/thumb-widget-3.png',
  'gallery-widget-4': '/assets/images/gallery/thumb-widget-4.png',
  'gallery-widget-5': '/assets/images/gallery/thumb-widget-5.png',
  'gallery-widget-6': '/assets/images/gallery/thumb-widget-6.png',
  'bg-about': '/assets/images/bg/about-bg-1.jpg',
  'bg-page': '/assets/images/bg/page-bg-1.jpg',
  'bg-features': '/assets/images/bg/features-bg-1.jpg',
  'category-all': '/assets/images/products/GLASS JARS/Whole Green Olives .png',
  'category-green-olives': '/assets/images/products/GLASS JARS/Whole Green Olives .png',
  'category-black-olives': '/assets/images/products/GLASS JARS/Whole Black Olives.png',
  'category-peppers': '/assets/images/products/GLASS JARS/pepperoncini Pepper.png',
  'category-pickles': '/assets/images/products/GLASS JARS/Artichoke Hearts .png',
};

export default async function handler(req, res) {
  // Prevent caching of this API response
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  try {
    const imageConfig = { ...DEFAULT_IMAGES };

    // Check Supabase Storage for uploaded images (with timeout to prevent hanging)
    const checkPromises = Object.entries(DEFAULT_IMAGES).map(async ([imageId, defaultPath]) => {
      try {
        let folder, filename;
        
        // Handle category images differently
        if (imageId.startsWith('category-')) {
          folder = 'categories';
          // Map image IDs to actual filenames as stored in Supabase
          const categoryFilenameMap = {
            'category-all': 'category-all-products.png',
            'category-green-olives': 'category-green-olives.png',
            'category-black-olives': 'category-black-olives.png',
            'category-peppers': 'category-peppers.png',
            'category-pickles': 'category-pickles.png',
          };
          filename = categoryFilenameMap[imageId] || (imageId.replace('category-', '') + '.png');
          
          // For category images, always construct Supabase URL (files are uploaded there)
          const storagePath = `${folder}/${filename}`;
          const { data: { publicUrl } } = supabaseAdmin
            .storage
            .from('website')
            .getPublicUrl(storagePath, { download: false });
          
          // Add strong cache-busting
          const cacheBuster = Date.now();
          imageConfig[imageId] = `${publicUrl}?v=${cacheBuster}&t=${cacheBuster}&cb=${Math.random()}`;
          console.log(`✅ Using Supabase URL for ${imageId} (${filename}): ${imageConfig[imageId]}`);
          return; // Skip the check below for category images
        } 
        // Handle sustainability images (always in Supabase)
        else if (imageId.startsWith('sustainability-')) {
          folder = 'sustainability';
          // Map image IDs to actual filenames as stored in Supabase
          const sustainabilityFilenameMap = {
            'sustainability-1': 'sus 1.jpg',
            'sustainability-2': 'sus 2.jpg',
            'sustainability-3': 'sus 3.jpg',
            'sustainability-4': 'sus 4.png',
          };
          filename = sustainabilityFilenameMap[imageId];
          
          // For sustainability images, always construct Supabase URL (files are uploaded there)
          const storagePath = `${folder}/${filename}`;
          const { data: { publicUrl } } = supabaseAdmin
            .storage
            .from('website')
            .getPublicUrl(storagePath, { download: false });
          
          // Add strong cache-busting
          const cacheBuster = Date.now();
          imageConfig[imageId] = `${publicUrl}?v=${cacheBuster}&t=${cacheBuster}&cb=${Math.random()}`;
          console.log(`✅ Using Supabase URL for ${imageId} (${filename}): ${imageConfig[imageId]}`);
          return; // Skip the check below for sustainability images
        } 
        else {
          // Regular images - parse path
          const pathParts = defaultPath.replace('/assets/images/', '').split('/');
          folder = pathParts[0];
          filename = pathParts[pathParts.length - 1];
        }
        
        // Construct storage path and check if file exists
        const storagePath = `${folder}/${filename}`;
        
        try {
          // Try to download the file to verify it exists (lightweight check)
          const { data: fileData, error: downloadError } = await Promise.race([
            supabaseAdmin.storage.from('website').download(storagePath),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1500))
          ]);

          // If download succeeds (even if we don't use the data), file exists
          if (!downloadError && fileData) {
            // Get public URL
            const { data: { publicUrl } } = supabaseAdmin
              .storage
              .from('website')
              .getPublicUrl(storagePath, { download: false });
            
            // Add strong cache-busting with current timestamp
            const cacheBuster = Date.now();
            
            imageConfig[imageId] = `${publicUrl}?v=${cacheBuster}&t=${cacheBuster}&cb=${Math.random()}`;
            console.log(`✅ Found Supabase image for ${imageId}: ${imageConfig[imageId]}`);
          } else {
            // File doesn't exist, try listing as fallback
            const { data: fileList } = await Promise.race([
              supabaseAdmin.storage.from('website').list(folder, { limit: 1000 }),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1000))
            ]);
            
            if (fileList) {
              const file = fileList.find(f => 
                f.name.toLowerCase() === filename.toLowerCase()
              );
              
              if (file) {
                const { data: { publicUrl } } = supabaseAdmin
                  .storage
                  .from('website')
                  .getPublicUrl(storagePath, { download: false });
                
                const cacheBuster = Date.now();
                imageConfig[imageId] = `${publicUrl}?v=${cacheBuster}&t=${cacheBuster}&cb=${Math.random()}`;
                console.log(`✅ Found Supabase image for ${imageId} (via list): ${imageConfig[imageId]}`);
              } else {
                console.log(`❌ File ${filename} not in list (found ${fileList.length} files in ${folder})`);
              }
            }
          }
        } catch (checkError) {
          // File doesn't exist or check failed, use default
          console.log(`Using default for ${imageId}: ${checkError.message}`);
        }
      } catch (err) {
        // Keep default path if Supabase check fails or times out
      }
    });

    // Wait for all checks with overall timeout
    await Promise.race([
      Promise.all(checkPromises),
      new Promise((resolve) => setTimeout(resolve, 5000)) // Max 5 seconds total
    ]);

    return res.status(200).json({
      success: true,
      images: imageConfig
    });
  } catch (error) {
    console.error('Error getting image config:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get image configuration',
      images: DEFAULT_IMAGES
    });
  }
}

