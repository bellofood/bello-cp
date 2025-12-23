import { supabaseAdmin } from '../../../lib/supabase';

/**
 * API Route: /api/site-settings/setup
 * Creates the site_settings table if it doesn't exist
 * Run this once to set up the database table
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Check if table exists by trying to query it
    const { error: checkError } = await supabaseAdmin
      .from('site_settings')
      .select('id')
      .limit(1);

    if (!checkError) {
      return res.status(200).json({
        success: true,
        message: 'Site settings table already exists!'
      });
    }

    // If table doesn't exist, provide SQL to create it
    if (checkError.code === '42P01' || checkError.message.includes('does not exist')) {
      return res.status(200).json({
        success: false,
        tableExists: false,
        message: 'Site settings table needs to be created. Please run the SQL script provided.',
        sqlScript: `
-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Contact Information
  company_name TEXT DEFAULT 'Bello Food',
  address TEXT DEFAULT '10th of Ramadan City, Industrial Area, Egypt',
  email TEXT DEFAULT 'marketing@bello-food.com',
  phone TEXT DEFAULT '+20 11 0 15 111 85',
  website TEXT DEFAULT 'www.bello-food.com',
  
  -- Social Media Links
  facebook_url TEXT DEFAULT '',
  twitter_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  youtube_url TEXT DEFAULT '',
  pinterest_url TEXT DEFAULT '',
  
  -- WhatsApp
  whatsapp_number TEXT DEFAULT '201101511185',
  whatsapp_message TEXT DEFAULT 'Hello Bello Food, I would like to inquire about your products',
  
  -- Additional Info
  working_hours TEXT DEFAULT 'Sunday - Thursday: 9:00 AM - 6:00 PM',
  google_maps_url TEXT DEFAULT 'https://maps.app.goo.gl/j7Qa6LR51jspaizn8?g_st=com.google.maps.preview.copy',
  
  -- Ad Settings
  ad_image TEXT DEFAULT '/assets/images/promo-banner.jpg',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_site_settings_created_at ON public.site_settings(created_at);

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.site_settings
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated users to update" ON public.site_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default settings
INSERT INTO public.site_settings (
  company_name,
  address,
  email,
  phone,
  website,
  whatsapp_number,
  whatsapp_message,
  working_hours,
  google_maps_url,
  ad_image
) VALUES (
  'Bello Food',
  '10th of Ramadan City, Industrial Area, Egypt',
  'marketing@bello-food.com',
  '+20 11 0 15 111 85',
  'www.bello-food.com',
  '201101511185',
  'Hello Bello Food, I would like to inquire about your products',
  'Sunday - Thursday: 9:00 AM - 6:00 PM',
  'https://maps.app.goo.gl/j7Qa6LR51jspaizn8?g_st=com.google.maps.preview.copy',
  '/assets/images/promo-banner.jpg'
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE public.site_settings IS 'Stores website configuration including contact info and social media links';
        `,
        instructions: `
To set up the site_settings table:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the SQL script above
4. Click "Run" to execute the script
5. Refresh this page to verify the table was created

The table will store:
- Contact information (address, email, phone, etc.)
- Social media links (Facebook, Twitter, Instagram, etc.)
- WhatsApp settings
- Working hours and Google Maps URL
        `
      });
    }

    // Other error
    return res.status(500).json({
      success: false,
      error: 'Error checking table: ' + checkError.message
    });

  } catch (error) {
    console.error('Setup error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}





