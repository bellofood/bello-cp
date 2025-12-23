const { supabaseAdmin } = require('../../../lib/supabase');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('homepage_featured_products')
      .select(`
        position,
        product_id,
        products (
          id,
          display_id,
          name_en,
          name_ar,
          name_ru,
          slug,
          category,
          main_image,
          is_published
        )
      `)
      .eq('products.is_published', true)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching featured products detail:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch featured products' 
      });
    }

    // Return products with their details
    const products = data
      ? data
          .filter(item => item.products) // Only include items with valid product references
          .map(item => ({
            position: item.position,
            ...item.products
          }))
      : [];

    return res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Featured products detail fetch error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}

