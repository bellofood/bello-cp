const { supabaseAdmin } = require('../../../lib/supabase');
const { verifyAuth } = require('../../../lib/auth');

export default async function handler(req, res) {
  const { id } = req.query;

  // GET - Fetch single news post
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabaseAdmin
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ 
          success: false, 
          error: 'News not found' 
        });
      }

      // Increment views count
      await supabaseAdmin
        .from('news')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', id);

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error('News fetch error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  // PUT - Update news
  if (req.method === 'PUT') {
    try {
      const { authenticated } = await verifyAuth(req);

      if (!authenticated) {
        return res.status(401).json({ 
          success: false, 
          error: 'Not authenticated' 
        });
      }

      const updateData = { ...req.body };
      delete updateData.id;
      delete updateData.created_at;
      delete updateData.display_id;
      delete updateData.views_count;

      // If publishing for first time, set published_at
      if (updateData.is_published && !updateData.published_at) {
        updateData.published_at = new Date().toISOString();
      }

      const { data, error } = await supabaseAdmin
        .from('news')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating news:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to update news' 
        });
      }

      return res.status(200).json({
        success: true,
        message: 'News updated successfully',
        data,
      });
    } catch (error) {
      console.error('News update error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  // DELETE - Delete news
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
        .from('news')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting news:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to delete news' 
        });
      }

      return res.status(200).json({
        success: true,
        message: 'News deleted successfully',
      });
    } catch (error) {
      console.error('News deletion error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}

