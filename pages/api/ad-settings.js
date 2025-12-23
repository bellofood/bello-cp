const { supabaseAdmin } = require('../../lib/supabase');

const supabase = supabaseAdmin;

export default async function handler(req, res) {
  // Add cache control headers to prevent caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  if (req.method === 'GET') {
    try {
      // Fetch the current ad image setting
      const { data, error } = await supabase
        .from('site_settings')
        .select('ad_image')
        .single();

      if (error) {
        // If no settings exist yet, return default
        return res.status(200).json({ 
          success: true, 
          adImage: '/assets/images/promo-banner.jpg' 
        });
      }

      res.status(200).json({ 
        success: true, 
        adImage: data?.ad_image || '/assets/images/promo-banner.jpg' 
      });
    } catch (error) {
      console.error('Error fetching ad settings:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch ad settings' });
    }
  } else if (req.method === 'POST') {
    try {
      const { adImage } = req.body;

      if (!adImage) {
        return res.status(400).json({ success: false, error: 'Ad image path is required' });
      }

      // Check if settings exist
      const { data: existingData } = await supabase
        .from('site_settings')
        .select('id')
        .single();

      let result;
      if (existingData) {
        // Update existing settings
        result = await supabase
          .from('site_settings')
          .update({ ad_image: adImage, updated_at: new Date().toISOString() })
          .eq('id', existingData.id);
      } else {
        // Insert new settings
        result = await supabase
          .from('site_settings')
          .insert({ ad_image: adImage });
      }

      if (result.error) {
        throw result.error;
      }

      res.status(200).json({ 
        success: true, 
        message: 'Ad image updated successfully',
        adImage 
      });
    } catch (error) {
      console.error('Error updating ad settings:', error);
      res.status(500).json({ success: false, error: 'Failed to update ad settings' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

