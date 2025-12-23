const { supabaseAdmin } = require('../../../lib/supabase');
const { verifyAuth } = require('../../../lib/auth');

export default async function handler(req, res) {
  // GET - Fetch all products
  if (req.method === 'GET') {
    try {
      const { published_only } = req.query;
      
      let query = supabaseAdmin
        .from('products')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      
      // If published_only parameter is true, filter published products
      if (published_only === 'true') {
        query = query.eq('is_published', true);
      }
      
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to fetch products' 
        });
      }

      return res.status(200).json({
        success: true,
        data: data || [],
      });
    } catch (error) {
      console.error('Products fetch error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  // POST - Create new product (requires authentication)
  if (req.method === 'POST') {
    try {
      // Verify authentication
      const { authenticated, user } = await verifyAuth(req);

      if (!authenticated) {
        return res.status(401).json({ 
          success: false, 
          error: 'Not authenticated' 
        });
      }

      const {
        name_en, name_ar, name_ru,
        slug,
        description_en, description_ar, description_ru,
        short_description_en, short_description_ar, short_description_ru,
        main_image,
        gallery_images,
        specifications,
        category,
        price,
        currency,
        is_featured,
        is_published,
        display_order,
        meta_title,
        meta_description,
        meta_keywords
      } = req.body;

      // Validate required fields
      if (!name_en || !slug) {
        return res.status(400).json({ 
          success: false, 
          error: 'Name (EN) and slug are required' 
        });
      }

      // Check if slug already exists
      const { data: existingProduct } = await supabaseAdmin
        .from('products')
        .select('id')
        .eq('slug', slug)
        .single();

      if (existingProduct) {
        return res.status(400).json({ 
          success: false, 
          error: 'Slug already exists' 
        });
      }

      // Insert product
      const { data, error } = await supabaseAdmin
        .from('products')
        .insert([
          {
            name_en, name_ar, name_ru,
            slug,
            description_en, description_ar, description_ru,
            short_description_en, short_description_ar, short_description_ru,
            main_image,
            gallery_images: gallery_images || [],
            specifications: specifications || {},
            category,
            price,
            currency: currency || 'USD',
            is_featured: is_featured || false,
            is_published: is_published !== undefined ? is_published : true,
            display_order: display_order || 0,
            meta_title,
            meta_description,
            meta_keywords,
            created_by: user.id,
            updated_by: user.id
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to create product' 
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data,
      });
    } catch (error) {
      console.error('Product creation error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}

