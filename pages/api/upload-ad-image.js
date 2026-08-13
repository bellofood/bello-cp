import formidable from 'formidable';
import fs from 'fs';
import os from 'os';
import path from 'path';

// Persistent storage target (same convention as /api/media/upload and
// /api/replace-website-image). Uploads must NEVER be written to the app
// directory: on Vercel the bundle lives in a read-only /var/task and is
// replaced on every deployment.
const STORAGE_BUCKET = 'website';
const STORAGE_FOLDER = 'banners';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Same allow-list used by the other image upload endpoints
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

const EXTENSION_BY_MIME = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
};

export const config = {
  api: {
    bodyParser: false,
  },
};

// Remove the temp file formidable staged in the OS temp dir. Best effort:
// the platform reclaims /tmp anyway, so a failure here must not fail the request.
function cleanupTempFile(filepath) {
  if (!filepath) return;
  try {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  } catch (error) {
    console.warn('⚠️ Could not remove temp upload file:', error.message);
  }
}

// Build a safe storage file name. Keep the "promo" prefix so ad blockers
// don't hide the banner, and derive the extension from the validated mime type.
function buildStorageFileName(uploadedFile) {
  const originalExt = path
    .extname(uploadedFile.originalFilename || uploadedFile.newFilename || '')
    .toLowerCase();
  const ext = /^\.[a-z0-9]{1,5}$/.test(originalExt)
    ? originalExt
    : EXTENSION_BY_MIME[uploadedFile.mimetype] || '';
  return `promo-${Date.now()}${ext}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  let uploadedFile = null;

  try {
    // Fail fast (and clearly) when storage is not configured. The Supabase
    // client throws while being constructed when these are missing, so the
    // check and the imports that depend on it both live inside the handler —
    // that way a misconfigured environment returns a proper API error instead
    // of an opaque module-load crash.
    const missingConfig = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
    ].filter((key) => !process.env[key]);

    if (missingConfig.length > 0) {
      console.error('❌ Storage is not configured. Missing env vars:', missingConfig.join(', '));
      return res.status(500).json({
        success: false,
        error: 'Image storage is not configured. Please contact the administrator.',
      });
    }

    const { supabaseAdmin: supabase } = require('../../lib/supabase');
    const { verifyAuth } = require('../../lib/auth');

    // Verify authentication (same as the other admin upload endpoints)
    const { authenticated } = await verifyAuth(req);
    if (!authenticated) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    // Stage the incoming file in the OS temp directory (/tmp on serverless).
    // This is scratch space only — the file is copied to persistent storage below.
    const form = formidable({
      uploadDir: os.tmpdir(),
      keepExtensions: true,
      maxFileSize: MAX_FILE_SIZE,
    });

    let files;
    try {
      files = await new Promise((resolve, reject) => {
        form.parse(req, (err, parsedFields, parsedFiles) => {
          if (err) reject(err);
          else resolve(parsedFiles);
        });
      });
    } catch (parseError) {
      console.error('❌ Form parse error:', parseError);
      const isTooLarge =
        parseError.httpCode === 413 ||
        parseError.code === 1009 ||
        /maxFileSize/i.test(parseError.message || '');
      if (isTooLarge) {
        return res.status(413).json({
          success: false,
          error: 'File is too large. Maximum size is 10MB.',
        });
      }
      return res.status(400).json({ success: false, error: 'Could not read the uploaded file' });
    }

    const file = files.adImage;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // Get the first file if it's an array
    uploadedFile = Array.isArray(file) ? file[0] : file;

    if (!uploadedFile.size) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    if (!ALLOWED_MIME_TYPES.includes(uploadedFile.mimetype)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file type. Only images allowed.',
      });
    }

    const fileBuffer = fs.readFileSync(uploadedFile.filepath);
    const fileName = buildStorageFileName(uploadedFile);
    const storagePath = `${STORAGE_FOLDER}/${fileName}`;

    console.log('📤 Uploading ad image:');
    console.log('   File size:', uploadedFile.size, 'bytes');
    console.log('   Mime type:', uploadedFile.mimetype);
    console.log('   Bucket:', STORAGE_BUCKET);
    console.log('   Path:', storagePath);

    // Upload to Supabase Storage — the persistent store that survives redeploys
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: uploadedFile.mimetype,
        upsert: true,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('❌ Supabase upload error:', uploadError);
      console.error('Error details:', JSON.stringify(uploadError, null, 2));
      return res.status(502).json({
        success: false,
        error: 'Failed to upload image to storage. Please try again.',
      });
    }

    console.log('✅ Upload successful!');

    // Get public URL
    const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // Update site settings with new ad image
    const { data: existingData, error: selectError } = await supabase
      .from('site_settings')
      .select('id')
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Database select error:', selectError);
      return res.status(500).json({ success: false, error: 'Database error' });
    }

    if (existingData) {
      const { error: updateError } = await supabase
        .from('site_settings')
        .update({ ad_image: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', existingData.id);

      if (updateError) {
        console.error('Database update error:', updateError);
        return res.status(500).json({ success: false, error: 'Failed to update database' });
      }
    } else {
      const { error: insertError } = await supabase
        .from('site_settings')
        .insert({ ad_image: publicUrl });

      if (insertError) {
        console.error('Database insert error:', insertError);
        return res.status(500).json({ success: false, error: 'Failed to insert to database' });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Ad image uploaded successfully',
      imageUrl: publicUrl,
    });
  } catch (error) {
    // Log everything server-side, return a message with no internal paths
    console.error('❌ Upload handler error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  } finally {
    cleanupTempFile(uploadedFile?.filepath);
  }
}
