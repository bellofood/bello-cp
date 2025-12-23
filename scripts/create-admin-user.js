/**
 * Script to create an admin user in Supabase
 * Usage: node scripts/create-admin-user.js
 */

const bcrypt = require('bcrypt');

async function generateAdminUser() {
  console.log('=== Admin User Generator ===\n');
  
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (query) => new Promise((resolve) => readline.question(query, resolve));

  try {
    const username = await question('Enter admin username (default: admin): ') || 'admin';
    const email = await question('Enter admin email (default: admin@belloo.com): ') || 'admin@belloo.com';
    const fullName = await question('Enter admin full name (default: Admin User): ') || 'Admin User';
    const password = await question('Enter admin password (default: admin123): ') || 'admin123';

    console.log('\nGenerating password hash...');
    const passwordHash = await bcrypt.hash(password, 10);

    console.log('\n=== Admin User Details ===');
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Full Name:', fullName);
    console.log('Password Hash:', passwordHash);

    console.log('\n=== SQL Query to Insert Admin User ===');
    console.log(`
INSERT INTO users (username, email, password_hash, full_name)
VALUES (
  '${username}',
  '${email}',
  '${passwordHash}',
  '${fullName}'
) ON CONFLICT (username) 
DO UPDATE SET 
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  full_name = EXCLUDED.full_name;
    `);

    console.log('\nCopy the SQL query above and run it in your Supabase SQL Editor.');
    console.log('Or update the existing admin user with the new password hash.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    readline.close();
  }
}

generateAdminUser();
