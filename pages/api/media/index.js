const { supabaseAdmin } = require('../../../lib/supabase');
const { verifyAuth } = require('../../../lib/auth');

export default async function handler(req, res) {
  // GET - Fetch media library
  if (req.method === 'GET') {
    try {
      const { authenticated } = await verifyAuth(req);

      if (!authenticated) {
        return res.status(401).json({ 
          success: false, 
          error: 'Not authenticated' 
        });
      }

      const { folder, limit } = req.query;
      
      let query = supabaseAdmin
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (folder) {
        query = query.eq('folder', folder);
      }
      
      if (limit) {
        query = query.limit(parseInt(limit));
      }
      
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching media:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to fetch media' 
        });
      }

      // Add public URLs
      const mediaWithUrls = data.map(item => {
        // Check if this is a static file (from /public folder)
        if (item.file_path && item.file_path.startsWith('/assets/')) {
          return {
            ...item,
            public_url: item.file_path, // Static files use direct path
            bucket: 'static',
            is_static: true
          };
        }
        
        // Otherwise it's from Supabase storage
        const bucket = item.folder === 'products' || item.folder.startsWith('product') 
          ? 'products' 
          : item.folder === 'news' || item.folder.startsWith('news')
          ? 'news'
          : 'website';
          
        const { data: { publicUrl } } = supabaseAdmin
          .storage
          .from(bucket)
          .getPublicUrl(item.file_path);
          
        return {
          ...item,
          public_url: publicUrl,
          bucket,
          is_static: false
        };
      });

      return res.status(200).json({
        success: true,
        data: mediaWithUrls,
      });
    } catch (error) {
      console.error('Media fetch error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  // DELETE - Delete media (bulk)
  if (req.method === 'DELETE') {
    try {
      const { authenticated } = await verifyAuth(req);

      if (!authenticated) {
        return res.status(401).json({ 
          success: false, 
          error: 'Not authenticated' 
        });
      }

      const { ids } = req.body;

      if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ 
          success: false, 
          error: 'IDs array required' 
        });
      }

      // Fetch media details
      const { data: mediaItems } = await supabaseAdmin
        .from('media_library')
        .select('*')
        .in('id', ids);

      // Delete from storage (skip static files)
      for (const item of mediaItems) {
        // Don't try to delete static files from storage
        if (item.file_path && item.file_path.startsWith('/assets/')) {
          continue;
        }
        
        const bucket = item.folder === 'products' || item.folder.startsWith('product') 
          ? 'products' 
          : item.folder === 'news' || item.folder.startsWith('news')
          ? 'news'
          : 'website';
          
        await supabaseAdmin
          .storage
          .from(bucket)
          .remove([item.file_path]);
      }

      // Delete from database
      const { error } = await supabaseAdmin
        .from('media_library')
        .delete()
        .in('id', ids);

      if (error) {
        console.error('Error deleting media:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to delete media' 
        });
      }

      return res.status(200).json({
        success: true,
        message: `Successfully deleted ${ids.length} media item(s)`,
      });
    } catch (error) {
      console.error('Media deletion error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}

