const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookie = require('cookie');
const { supabaseAdmin } = require('./supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

/**
 * Hash a password using bcrypt
 */
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

/**
 * Compare a password with a hash
 */
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for a user
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Verify a JWT token
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from request cookies
 */
function getTokenFromRequest(req) {
  if (!req.headers.cookie) {
    return null;
  }
  
  const cookies = cookie.parse(req.headers.cookie);
  return cookies.auth_token || null;
}

/**
 * Verify authentication from request
 */
async function verifyAuth(req) {
  const token = getTokenFromRequest(req);
  
  if (!token) {
    return { authenticated: false, user: null };
  }
  
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return { authenticated: false, user: null };
  }
  
  // Verify user still exists in database
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', decoded.id)
    .single();
  
  if (error || !user) {
    return { authenticated: false, user: null };
  }
  
  return { authenticated: true, user };
}

/**
 * Create an authentication cookie
 */
function createAuthCookie(token) {
  return cookie.serialize('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

/**
 * Create a cookie to clear authentication
 */
function clearAuthCookie() {
  return cookie.serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}

/**
 * Authenticate user with username/email and password
 */
async function authenticateUser(usernameOrEmail, password) {
  // Try to find user by username or email
  const { data: users, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .or(`username.eq.${usernameOrEmail},email.eq.${usernameOrEmail}`)
    .limit(1);
  
  if (error || !users || users.length === 0) {
    return { success: false, error: 'Invalid credentials' };
  }
  
  const user = users[0];
  
  // Compare password
  const isValid = await comparePassword(password, user.password_hash);
  
  if (!isValid) {
    return { success: false, error: 'Invalid credentials' };
  }
  
  // Update last login
  await supabaseAdmin
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', user.id);
  
  // Generate token
  const token = generateToken(user);
  
  return { success: true, user, token };
}

// Export all functions
module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  getTokenFromRequest,
  verifyAuth,
  createAuthCookie,
  clearAuthCookie,
  authenticateUser
};

