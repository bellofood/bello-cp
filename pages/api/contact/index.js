import { supabaseAdmin } from '../../../lib/supabase';
import { verifyAuth } from '../../../lib/auth';

export default async function handler(req, res) {
  // GET - Fetch all contact submissions (requires authentication)
  if (req.method === 'GET') {
    try {
      // Verify authentication
      const { authenticated } = await verifyAuth(req);

      if (!authenticated) {
        return res.status(401).json({ 
          success: false, 
          error: 'Not authenticated' 
        });
      }

      // Fetch all contact submissions, ordered by newest first
      const { data, error } = await supabaseAdmin
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contact submissions:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to fetch contact submissions' 
        });
      }

      return res.status(200).json({
        success: true,
        data: data || [],
      });
    } catch (error) {
      console.error('Contact fetch error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  // POST - Create a new contact submission (public endpoint)
  if (req.method === 'POST') {
    try {
      const { name, email, phone, subject, message } = req.body;

      // Validate required fields
      if (!name || !email || !phone || !subject || !message) {
        return res.status(400).json({ 
          success: false, 
          error: 'All fields are required' 
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid email format' 
        });
      }

      // Insert contact submission
      const { data, error } = await supabaseAdmin
        .from('contact_submissions')
        .insert([
          {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            subject: subject.trim(),
            message: message.trim(),
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating contact submission:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to submit contact form' 
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Contact form submitted successfully',
        data,
      });
    } catch (error) {
      console.error('Contact submission error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}

