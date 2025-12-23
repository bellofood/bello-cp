import { verifyAuth } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    console.log('[VERIFY] Starting verification...');
    console.log('[VERIFY] Headers:', req.headers.cookie ? 'Cookie present' : 'No cookie');
    
    const { authenticated, user } = await verifyAuth(req);

    console.log('[VERIFY] Authenticated:', authenticated);
    console.log('[VERIFY] User:', user ? user.username : 'none');

    if (!authenticated) {
      console.log('[VERIFY] Not authenticated - returning 401');
      return res.status(401).json({ 
        success: false, 
        error: 'Not authenticated' 
      });
    }

    console.log('[VERIFY] Success - returning user data');
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        last_login: user.last_login,
      },
    });
  } catch (error) {
    console.error('[VERIFY] ERROR:', error);
    console.error('[VERIFY] Error stack:', error.stack);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

