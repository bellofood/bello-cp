import { verifyAuth } from '../../../lib/auth';
import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  // Verify authentication for all requests
  const { authenticated } = await verifyAuth(req);
  
  if (!authenticated) {
    return res.status(401).json({ 
      success: false, 
      error: 'Not authenticated' 
    });
  }

  if (req.method === 'GET') {
    try {
      const { search } = req.query;

      let query = supabaseAdmin
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      // Search by username (part before @)
      if (search) {
        // Search for emails that start with the search term before the @
        query = query.ilike('email', `${search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching newsletter subscribers:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to fetch subscribers' 
        });
      }

      return res.status(200).json({ 
        success: true, 
        data,
        count: data.length
      });

    } catch (error) {
      console.error('Newsletter fetch error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'Subscriber ID is required' 
        });
      }

      const { error } = await supabaseAdmin
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting subscriber:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to delete subscriber' 
        });
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Subscriber deleted successfully' 
      });

    } catch (error) {
      console.error('Newsletter delete error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  return res.status(405).json({ 
    success: false, 
    error: 'Method not allowed' 
  });
}

