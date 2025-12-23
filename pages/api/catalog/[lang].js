import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { lang } = req.query;

    // Validate language
    if (lang !== 'en' && lang !== 'ru') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid language. Use "en" or "ru"' 
      });
    }

    // Determine PDF filename based on language
    // Using URL-friendly filenames without spaces
    const pdfFileName = lang === 'en' 
      ? 'Olive-profile-25x15cm-EN-HD.pdf'
      : 'Olive-profile-25x15cm-RU-HD.pdf';
    
    // Also try the old filename format for backward compatibility
    const oldFileName = lang === 'en' 
      ? 'Olive profile (25 x 15 cm)  EN-HD.pdf'
      : 'Olive profile (25 x 15 cm)  RU-HD.pdf';

    let fileBuffer = null;

    // Try both new and old filenames
    const fileNamesToTry = [pdfFileName, oldFileName];

    // Try to read from file system first (works in local development)
    for (const fileName of fileNamesToTry) {
      const localPath = path.join(process.cwd(), 'public', 'assets', 'pdf', fileName);
      try {
        if (fs.existsSync(localPath)) {
          fileBuffer = fs.readFileSync(localPath);
          console.log(`✅ Found PDF at local path: ${localPath}`);
          break;
        }
      } catch (err) {
        // Continue to next filename
        continue;
      }
    }

    // If file system access failed (Vercel serverless), redirect to public URL
    // This is simpler and more reliable - let Next.js/Vercel serve the static file directly
    if (!fileBuffer) {
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const host = req.headers.host || req.headers['x-forwarded-host'];
      const baseUrl = `${protocol}://${host}`;
      
      // Use the new filename (URL-friendly, no spaces)
      const publicUrl = `${baseUrl}/assets/pdf/${pdfFileName}`;
      
      console.log(`Redirecting to public URL: ${publicUrl}`);
      // Redirect to let Next.js serve the static file directly
      return res.redirect(302, publicUrl);
    }

    // This should never be reached since we redirect if fileBuffer is null
    // But keeping it as a safety check
    if (!fileBuffer) {
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const host = req.headers.host || req.headers['x-forwarded-host'];
      const baseUrl = `${protocol}://${host}`;
      const testUrl = `${baseUrl}/assets/pdf/${pdfFileName}`;
      
      return res.status(404).json({ 
        success: false, 
        error: 'PDF file not found',
        details: {
          triedFilenames: fileNamesToTry,
          testUrl: testUrl,
          message: 'Please verify the PDF files are accessible at the public URL above. If not, ensure they are committed and deployed to Vercel.'
        }
      });
    }

    // Set response headers for PDF viewing
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${pdfFileName}"`);
    res.setHeader('Content-Length', fileBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

    // Send file
    return res.status(200).send(fileBuffer);
  } catch (error) {
    console.error('Error serving PDF:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message
    });
  }
}

