import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  try {
    console.log('=== CHECKING SETUP ===');
    
    // Check environment variables
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      JWT_SECRET: !!process.env.JWT_SECRET,
    };

    console.log('Environment variables:', envCheck);

    // Check if users table exists and count users
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, username, email')
      .limit(10);

    console.log('Users query result:', { users, error: usersError });

    // Try to find admin user specifically
    const { data: adminUser, error: adminError } = await supabaseAdmin
      .from('users')
      .select('id, username, email, full_name, created_at')
      .eq('username', 'admin')
      .single();

    console.log('Admin user query:', { adminUser, error: adminError });

    return res.status(200).json({
      success: true,
      environment: envCheck,
      allEnvVarsPresent: Object.values(envCheck).every(v => v === true),
      usersTable: {
        exists: !usersError,
        error: usersError?.message,
        userCount: users?.length || 0,
        users: users?.map(u => ({ id: u.id, username: u.username, email: u.email }))
      },
      adminUser: {
        exists: !adminError && !!adminUser,
        error: adminError?.message,
        details: adminUser ? {
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
          full_name: adminUser.full_name,
          created_at: adminUser.created_at
        } : null
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}

