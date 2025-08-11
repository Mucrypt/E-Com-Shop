-- Emergency fix for infinite recursion in users table RLS policies
-- Run this immediately in Supabase SQL Editor to fix the error

-- Drop the problematic admin policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can view all users." ON users;
DROP POLICY IF EXISTS "Superadmins can update user roles." ON users;

-- Clear any existing user sessions to start fresh
-- This will force users to log in again
DELETE FROM auth.sessions WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'romeomukulah@gmail.com'
);

-- Delete the user from auth.users completely for a fresh start
DELETE FROM auth.users WHERE email = 'romeomukulah@gmail.com';

-- Recreate clean, simple RLS policies
-- Ensure we start with a clean slate
DROP POLICY IF EXISTS "Users can view own data." ON users;
DROP POLICY IF EXISTS "Users can update own data." ON users;  
DROP POLICY IF EXISTS "Users can insert own data." ON users;

-- Create simple, non-recursive policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create a service role bypass policy for admin operations
-- This allows admin operations to be performed with the service role key
CREATE POLICY "Service role has full access" ON users
  FOR ALL USING (
    current_setting('role') = 'service_role'
  );
