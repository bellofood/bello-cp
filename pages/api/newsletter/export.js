import { verifyAuth } from '../../../lib/auth';
import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Verify authentication
  const { authenticated } = await verifyAuth(req);
  
  if (!authenticated) {
    return res.status(401).json({ 
      success: false, 
      error: 'Not authenticated' 
    });
  }

  try {
    const { format = 'csv' } = req.query;

    // Fetch all active subscribers
    const { data, error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('*')
      .eq('is_active', true)
      .order('subscribed_at', { ascending: false });

    if (error) {
      console.error('Error fetching subscribers for export:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch subscribers' 
      });
    }

    if (format === 'csv') {
      // Generate CSV
      const headers = ['Email', 'Source', 'Language', 'Subscribed At'];
      const csvRows = [headers.join(',')];

      data.forEach(subscriber => {
        const row = [
          subscriber.email,
          subscriber.source || '',
          subscriber.language || '',
          new Date(subscriber.subscribed_at).toLocaleString()
        ];
        csvRows.push(row.join(','));
      });

      const csvContent = csvRows.join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
      return res.status(200).send(csvContent);
    }

    if (format === 'json') {
      // Generate JSON
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=newsletter-subscribers-${new Date().toISOString().split('T')[0]}.json`);
      return res.status(200).json(data);
    }

    if (format === 'txt') {
      // Generate TXT (email list only)
      const emailList = data.map(s => s.email).join('\n');
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename=newsletter-emails-${new Date().toISOString().split('T')[0]}.txt`);
      return res.status(200).send(emailList);
    }

    return res.status(400).json({ 
      success: false, 
      error: 'Invalid export format. Use csv, json, or txt' 
    });

  } catch (error) {
    console.error('Newsletter export error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}

