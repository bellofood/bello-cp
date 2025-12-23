import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Try to query the newsletter_subscribers table
    const { data, error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('count')
      .limit(1);

    if (error) {
      return res.status(200).json({ 
        success: false, 
        tableExists: false,
        error: error.message,
        message: 'Newsletter table does not exist. Please run the SQL setup script in Supabase.'
      });
    }

    return res.status(200).json({ 
      success: true, 
      tableExists: true,
      message: 'Newsletter table is properly set up!'
    });

  } catch (error) {
    return res.status(200).json({ 
      success: false, 
      tableExists: false,
      error: error.message,
      message: 'Error checking table. Please run the SQL setup script in Supabase.'
    });
  }
}

