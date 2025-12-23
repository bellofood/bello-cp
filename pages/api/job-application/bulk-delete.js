import { supabaseAdmin } from '../../../lib/supabase';
import { verifyAuth } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
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

    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'IDs array is required' 
      });
    }

    console.log('Deleting job applications with IDs:', ids);

    // First, fetch the applications to get CV file paths
    const { data: applications, error: fetchError } = await supabaseAdmin
      .from('job_applications')
      .select('cv_file_path')
      .in('id', ids);

    if (fetchError) {
      console.error('Error fetching applications:', fetchError);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch applications' 
      });
    }

    // Delete CV files from storage
    const cvFilesToDelete = applications
      .filter(app => app.cv_file_path)
      .map(app => app.cv_file_path);

    if (cvFilesToDelete.length > 0) {
      const { error: storageError } = await supabaseAdmin
        .storage
        .from('cvs')
        .remove(cvFilesToDelete);

      if (storageError) {
        console.error('Error deleting CV files:', storageError);
        // Continue anyway, we'll still delete the database records
      }
    }

    // Delete job applications from database
    const { error } = await supabaseAdmin
      .from('job_applications')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('Error deleting job applications:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to delete job applications',
        details: error
      });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${ids.length} job application(s)`,
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}

