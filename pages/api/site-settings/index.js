import { supabaseAdmin } from '../../../lib/supabase';

/**
 * API Route: /api/site-settings
 * Handles CRUD operations for site settings (contact info, social media links, etc.)
 */

export default async function handler(req, res) {
  try {
    // GET - Fetch site settings
    if (req.method === 'GET') {
      const { data, error } = await supabaseAdmin
        .from('site_settings')
        .select('*')
        .single();

      if (error) {
        // If no settings exist yet, return defaults
        if (error.code === 'PGRST116') {
          return res.status(200).json({
            success: true,
            data: {
              // Contact Information
              company_name: 'Bello Food',
              address: '10th of Ramadan City, Industrial Area, Egypt',
              email: 'marketing@bello-food.com',
              phone: '+20 11 0 15 111 85',
              website: 'www.bello-food.com',
              
              // Social Media Links
              facebook_url: '',
              twitter_url: '',
              instagram_url: '',
              linkedin_url: '',
              youtube_url: '',
              pinterest_url: '',
              
              // WhatsApp
              whatsapp_number: '201101511185',
              whatsapp_message: 'Hello Bello Food, I would like to inquire about your products',
              
              // Additional Info
              working_hours: 'Sunday - Thursday: 9:00 AM - 6:00 PM',
              google_maps_url: 'https://maps.app.goo.gl/j7Qa6LR51jspaizn8?g_st=com.google.maps.preview.copy',
              
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          });
        }
        
        console.error('Error fetching site settings:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch site settings: ' + error.message
        });
      }

      return res.status(200).json({
        success: true,
        data
      });
    }

    // PUT/POST - Update or create site settings
    if (req.method === 'PUT' || req.method === 'POST') {
      const {
        company_name,
        address,
        email,
        phone,
        website,
        facebook_url,
        twitter_url,
        instagram_url,
        linkedin_url,
        youtube_url,
        pinterest_url,
        whatsapp_number,
        whatsapp_message,
        working_hours,
        google_maps_url
      } = req.body;

      // Check if settings already exist
      const { data: existing } = await supabaseAdmin
        .from('site_settings')
        .select('id')
        .single();

      const settingsData = {
        company_name,
        address,
        email,
        phone,
        website,
        facebook_url,
        twitter_url,
        instagram_url,
        linkedin_url,
        youtube_url,
        pinterest_url,
        whatsapp_number,
        whatsapp_message,
        working_hours,
        google_maps_url,
        updated_at: new Date().toISOString()
      };

      let data, error;

      if (existing) {
        // Update existing settings
        ({ data, error } = await supabaseAdmin
          .from('site_settings')
          .update(settingsData)
          .eq('id', existing.id)
          .select()
          .single());
      } else {
        // Create new settings
        settingsData.created_at = new Date().toISOString();
        ({ data, error } = await supabaseAdmin
          .from('site_settings')
          .insert([settingsData])
          .select()
          .single());
      }

      if (error) {
        console.error('Error saving site settings:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to save site settings: ' + error.message
        });
      }

      return res.status(200).json({
        success: true,
        data,
        message: 'Site settings updated successfully'
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });

  } catch (error) {
    console.error('Site settings API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}





