import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  try {
    console.log('🔍 Testing image config API...');
    
    // Test skill-5 specifically
    const { data: files } = await supabaseAdmin
      .storage
      .from('website')
      .list('skill', {
        limit: 100,
        search: 'skill-5.png'
      });
    
    console.log('Files found:', files);
    
    let publicUrl = null;
    if (files && files.length > 0) {
      const { data: { publicUrl: url } } = supabaseAdmin
        .storage
        .from('website')
        .getPublicUrl('skill/skill-5.png');
      publicUrl = url;
    }
    
    return res.status(200).json({
      success: true,
      searchResults: files,
      fileExists: files && files.length > 0,
      publicUrl: publicUrl,
      publicUrlWithCache: publicUrl ? `${publicUrl}?t=${Date.now()}` : null
    });
    
  } catch (error) {
    console.error('Test error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

