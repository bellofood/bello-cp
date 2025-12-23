const { supabaseAdmin } = require('../../../lib/supabase');
const { verifyAuth } = require('../../../lib/auth');

export default async function handler(req, res) {
  // GET - Fetch featured products
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabaseAdmin
        .from('homepage_featured_products')
        .select('*')
        .order('position', { ascending: true });

      if (error) {
        console.error('Error fetching featured products:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to fetch featured products' 
        });
      }

      // Return array of 6 product IDs in order
      const productIds = new Array(6).fill(null);
      if (data) {
        data.forEach(item => {
          if (item.position >= 1 && item.position <= 6) {
            productIds[item.position - 1] = item.product_id;
          }
        });
      }

      return res.status(200).json({
        success: true,
        data: productIds
      });
    } catch (error) {
      console.error('Featured products fetch error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  // POST - Save featured products (requires authentication)
  if (req.method === 'POST') {
    try {
      const authCheck = await verifyAuth(req);
      if (!authCheck.authenticated) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { productIds } = req.body;

      if (!Array.isArray(productIds) || productIds.length !== 6) {
        return res.status(400).json({ 
          success: false, 
          error: 'Must provide exactly 6 product IDs' 
        });
      }

      // Delete existing featured products
      await supabaseAdmin
        .from('homepage_featured_products')
        .delete()
        .neq('position', 0); // Delete all

      // Insert new featured products
      const inserts = productIds
        .map((productId, index) => ({
          product_id: productId,
          position: index + 1
        }))
        .filter(item => item.product_id !== null);

      if (inserts.length > 0) {
        const { error: insertError } = await supabaseAdmin
          .from('homepage_featured_products')
          .insert(inserts);

        if (insertError) {
          console.error('Error inserting featured products:', insertError);
          return res.status(500).json({ 
            success: false, 
            error: 'Failed to save featured products' 
          });
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Featured products updated successfully'
      });
    } catch (error) {
      console.error('Featured products save error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}

