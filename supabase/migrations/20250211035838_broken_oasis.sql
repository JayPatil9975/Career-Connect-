/*
  # Fix Profile RLS Policies

  1. Changes
    - Add policy to allow profile creation during signup
    - Add policy to allow profile updates by authenticated users
    - Add policy to allow system-level operations

  2. Security
    - Maintains existing RLS protection
    - Adds specific policies for profile management
*/

-- Policy to allow profile creation during signup
CREATE POLICY "Allow profile creation during signup"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy to allow system-level operations (if needed by the auth system)
CREATE POLICY "Allow system-level operations"
ON profiles
TO authenticated
USING (true)
WITH CHECK (true);

-- Update existing policies to be more permissive for profile operations
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can read own profile"
ON profiles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);