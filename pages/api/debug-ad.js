import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    // Check if table exists
    const { data: tableData, error: tableError } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1);

    if (tableError) {
      return res.status(200).json({
        tableExists: false,
        error: tableError.message,
        solution: 'You need to run the SQL script to create the site_settings table. Check database/create_site_settings_table.sql'
      });
    }

    // Fetch all settings
    const { data: allData, error: fetchError } = await supabase
      .from('site_settings')
      .select('*');

    if (fetchError) {
      return res.status(200).json({
        tableExists: true,
        error: fetchError.message,
        data: null
      });
    }

    return res.status(200).json({
      tableExists: true,
      rowCount: allData?.length || 0,
      data: allData,
      currentAd: allData?.[0]?.ad_image || '/assets/images/promo-banner.jpg'
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
}

