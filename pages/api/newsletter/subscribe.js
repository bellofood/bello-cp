import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, source, language } = req.body;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide a valid email address' 
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const { data: existingSubscriber } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', normalizedEmail)
      .single();

    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        return res.status(200).json({ 
          success: true, 
          message: 'You are already subscribed to our newsletter!',
          alreadySubscribed: true
        });
      } else {
        // Reactivate subscription
        const { error: updateError } = await supabaseAdmin
          .from('newsletter_subscribers')
          .update({ 
            is_active: true,
            resubscribed_at: new Date().toISOString(),
            source: source || 'Website',
            language: language || 'en'
          })
          .eq('id', existingSubscriber.id);

        if (updateError) {
          console.error('Error reactivating subscription:', updateError);
          return res.status(500).json({ 
            success: false, 
            error: 'Failed to reactivate subscription' 
          });
        }

        return res.status(200).json({ 
          success: true, 
          message: 'Welcome back! Your subscription has been reactivated.',
          reactivated: true
        });
      }
    }

    // Create new subscription
    const { data, error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert([
        {
          email: normalizedEmail,
          source: source || 'Website',
          language: language || 'en',
          is_active: true,
          subscribed_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving newsletter subscription:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to save subscription. Please try again.' 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Thank you for subscribing to our newsletter!',
      data 
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    });
  }
}

