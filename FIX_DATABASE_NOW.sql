-- ⚡ QUICK FIX for "Failed to create post" error
-- Run this in your Supabase SQL Editor to fix the database

-- Step 1: Add wallet_address column
ALTER TABLE posts ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Step 2: Make user_id optional (not required)
ALTER TABLE posts ALTER COLUMN user_id DROP NOT NULL;

-- Step 3: Remove the foreign key constraint
DO $$ 
BEGIN
    ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_user_id_fkey;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- Step 4: Drop ALL existing policies (including ones that might already exist)
DROP POLICY IF EXISTS "Authenticated users can insert posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
DROP POLICY IF EXISTS "Anyone can insert posts" ON posts;
DROP POLICY IF EXISTS "Anyone can update posts" ON posts;
DROP POLICY IF EXISTS "Anyone can delete posts" ON posts;

-- Step 5: Create new permissive policies for wallet-based usage
CREATE POLICY "Anyone can insert posts"
ON posts FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update posts"
ON posts FOR UPDATE
USING (true)
WITH CHECK (true);

-- Step 6: Ensure category defaults are set
UPDATE posts SET category = 'other' WHERE category IS NULL;
ALTER TABLE posts ALTER COLUMN category SET DEFAULT 'other';

-- Step 7: Create index on wallet_address
CREATE INDEX IF NOT EXISTS posts_wallet_address_idx ON posts(wallet_address);

-- ✅ Done! Your app should now work correctly.
-- Try creating a post again.

