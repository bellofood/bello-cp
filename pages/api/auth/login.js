import { authenticateUser, createAuthCookie } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username and password are required' 
      });
    }

    // Authenticate user
    const result = await authenticateUser(username, password);

    if (!result.success) {
      return res.status(401).json({ 
        success: false, 
        error: result.error 
      });
    }

    // Set authentication cookie
    res.setHeader('Set-Cookie', createAuthCookie(result.token));

    return res.status(200).json({
      success: true,
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        full_name: result.user.full_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}

