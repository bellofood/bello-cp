import { supabaseAdmin } from '../../../lib/supabase';
import { verifyAuth } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const { authenticated } = await verifyAuth(req);

    if (!authenticated) {
      return res.status(401).json({ 
        success: false, 
        error: 'Not authenticated' 
      });
    }

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Application ID is required' 
      });
    }

    // Fetch application details
    const { data: application, error: fetchError } = await supabaseAdmin
      .from('job_applications')
      .select('cv_file_path, cv_file_name')
      .eq('id', id)
      .single();

    if (fetchError || !application) {
      return res.status(404).json({ 
        success: false, 
        error: 'Application not found' 
      });
    }

    if (!application.cv_file_path) {
      return res.status(404).json({ 
        success: false, 
        error: 'No CV file found for this application' 
      });
    }

    // Download file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabaseAdmin
      .storage
      .from('cvs')
      .download(application.cv_file_path);

    if (downloadError) {
      console.error('Error downloading CV:', downloadError);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to download CV file' 
      });
    }

    // Convert blob to buffer
    const buffer = Buffer.from(await fileData.arrayBuffer());

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${application.cv_file_name}"`);
    res.setHeader('Content-Length', buffer.length);

    // Send file
    return res.status(200).send(buffer);
  } catch (error) {
    console.error('Download CV error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}

