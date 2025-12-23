const { supabaseAdmin } = require('../../../lib/supabase');
const { verifyAuth } = require('../../../lib/auth');

export default async function handler(req, res) {
  const { id } = req.query;

  // GET - Fetch single product
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ 
          success: false, 
          error: 'Product not found' 
        });
      }

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error('Product fetch error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  // PUT - Update product (requires authentication)
  if (req.method === 'PUT') {
    try {
      const { authenticated, user } = await verifyAuth(req);

      if (!authenticated) {
        return res.status(401).json({ 
          success: false, 
          error: 'Not authenticated' 
        });
      }

      const updateData = { ...req.body };
      updateData.updated_by = user.id;
      delete updateData.id;
      delete updateData.created_at;
      delete updateData.display_id;

      const { data, error } = await supabaseAdmin
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to update product' 
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data,
      });
    } catch (error) {
      console.error('Product update error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  // DELETE - Delete product (requires authentication)
  if (req.method === 'DELETE') {
    try {
      const { authenticated } = await verifyAuth(req);

      if (!authenticated) {
        return res.status(401).json({ 
          success: false, 
          error: 'Not authenticated' 
        });
      }

      const { error } = await supabaseAdmin
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to delete product' 
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      console.error('Product deletion error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}

