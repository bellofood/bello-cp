import { verifyAuth, hashPassword, comparePassword } from '../../../lib/auth';
import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const { authenticated, user } = await verifyAuth(req);

    if (!authenticated) {
      return res.status(401).json({ 
        success: false, 
        error: 'Not authenticated' 
      });
    }

    const { username, full_name, email, current_password, new_password } = req.body;

    if (!username || !full_name || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username, full name and email are required' 
      });
    }

    // Check if username is being changed and if it's already taken
    if (username !== user.username) {
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('username', username)
        .neq('id', user.id)
        .single();

      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          error: 'Username is already taken' 
        });
      }
    }

    const updates = {
      username,
      full_name,
      email,
    };

    // If password change is requested
    if (new_password) {
      if (!current_password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Current password is required to set a new password' 
        });
      }

      // Verify current password
      const isValid = await comparePassword(current_password, user.password_hash);
      
      if (!isValid) {
        return res.status(400).json({ 
          success: false, 
          error: 'Current password is incorrect' 
        });
      }

      // Hash new password
      updates.password_hash = await hashPassword(new_password);
    }

    // Update user in database
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to update profile' 
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: data.id,
        username: data.username,
        email: data.email,
        full_name: data.full_name,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}

