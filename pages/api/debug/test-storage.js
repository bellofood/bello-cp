import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  try {
    console.log('🔍 Testing Supabase Storage setup...');
    
    // List all buckets
    const { data: buckets, error: bucketsError } = await supabaseAdmin
      .storage
      .listBuckets();
    
    console.log('Buckets:', buckets);
    console.log('Buckets error:', bucketsError);
    
    // Try to list files in website bucket
    let websiteBucketTest = null;
    if (buckets && buckets.find(b => b.name === 'website')) {
      const { data: files, error: filesError } = await supabaseAdmin
        .storage
        .from('website')
        .list('skill', {
          limit: 10
        });
      
      websiteBucketTest = {
        exists: true,
        files: files,
        error: filesError?.message
      };
    }
    
    return res.status(200).json({
      success: true,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      buckets: buckets?.map(b => ({
        name: b.name,
        id: b.id,
        public: b.public,
        created_at: b.created_at
      })),
      bucketsError: bucketsError?.message,
      websiteBucket: websiteBucketTest,
      needsSetup: !buckets || buckets.length === 0 || !buckets.find(b => b.name === 'website')
    });
    
  } catch (error) {
    console.error('Storage test error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}

