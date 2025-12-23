const { supabaseAdmin } = require('../../../lib/supabase');
const { verifyAuth } = require('../../../lib/auth');

export default async function handler(req, res) {
  // GET - Fetch all news/blog posts
  if (req.method === 'GET') {
    try {
      const { published_only, category, limit, slug } = req.query;
      
      let query = supabaseAdmin
        .from('news')
        .select('*');
      
      // If slug is provided, fetch specific post
      if (slug) {
        query = query.eq('slug', slug);
      } else {
        // Otherwise, fetch list with ordering
        query = query
          .order('published_at', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false });
      }
      
      if (published_only === 'true') {
        query = query.eq('is_published', true);
      }
      
      if (category) {
        query = query.eq('category', category);
      }
      
      if (limit && !slug) {
        query = query.limit(parseInt(limit));
      }
      
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching news:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to fetch news' 
        });
      }

      return res.status(200).json({
        success: true,
        data: data || [],
      });
    } catch (error) {
      console.error('News fetch error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  // POST - Create new news/blog post (requires authentication)
  if (req.method === 'POST') {
    try {
      const { authenticated, user } = await verifyAuth(req);

      if (!authenticated) {
        return res.status(401).json({ 
          success: false, 
          error: 'Not authenticated' 
        });
      }

      const {
        title_en, title_ar, title_ru,
        slug,
        content_en, content_ar, content_ru,
        excerpt_en, excerpt_ar, excerpt_ru,
        featured_image,
        gallery_images,
        category,
        tags,
        author_name,
        is_published,
        published_at,
        meta_title,
        meta_description
      } = req.body;

      if (!title_en || !slug) {
        return res.status(400).json({ 
          success: false, 
          error: 'Title (EN) and slug are required' 
        });
      }

      // Check if slug exists
      const { data: existing } = await supabaseAdmin
        .from('news')
        .select('id')
        .eq('slug', slug)
        .single();

      if (existing) {
        return res.status(400).json({ 
          success: false, 
          error: 'Slug already exists' 
        });
      }

      const { data, error } = await supabaseAdmin
        .from('news')
        .insert([
          {
            title_en, title_ar, title_ru,
            slug,
            content_en, content_ar, content_ru,
            excerpt_en, excerpt_ar, excerpt_ru,
            featured_image,
            gallery_images: gallery_images || [],
            category,
            tags: tags || [],
            author_name: author_name || user.full_name || user.username,
            author_id: user.id,
            is_published: is_published || false,
            published_at: is_published ? (published_at || new Date().toISOString()) : null,
            meta_title,
            meta_description
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating news:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to create news' 
        });
      }

      return res.status(201).json({
        success: true,
        message: 'News created successfully',
        data,
      });
    } catch (error) {
      console.error('News creation error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}

