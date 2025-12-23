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

    console.log('Deleting contact submissions with IDs:', ids);

    // Delete contact submissions
    const { error } = await supabaseAdmin
      .from('contact_submissions')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('Error deleting contact submissions:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to delete contact submissions',
        details: error
      });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${ids.length} contact submission(s)`,
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}

