const { createClient } = require('@supabase/supabase-js');

// Debug logging
if (typeof window === 'undefined') {
  // Server-side only
  console.log('[SUPABASE] Initializing...');
  console.log('[SUPABASE] URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('[SUPABASE] ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  console.log('[SUPABASE] SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// Supabase client for client-side operations (uses anon key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Supabase admin client for server-side operations (uses service role key)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Helper function to get Supabase client in API routes
function getSupabaseClient(useServiceRole = false) {
  if (useServiceRole) {
    return supabaseAdmin;
  }
  return supabase;
}

module.exports = {
  supabase,
  supabaseAdmin,
  getSupabaseClient
};

