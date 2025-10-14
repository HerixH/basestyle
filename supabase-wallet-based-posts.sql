-- Migration: Update posts table to use wallet addresses instead of user_id
-- This allows anyone to post without authentication

-- Step 1: Add wallet_address column if it doesn't exist
ALTER TABLE posts ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Step 2: Make user_id nullable (for backwards compatibility)
ALTER TABLE posts ALTER COLUMN user_id DROP NOT NULL;

-- Step 3: Drop the old foreign key constraint if it exists
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_user_id_fkey;

-- Step 4: Create index on wallet_address for faster queries
CREATE INDEX IF NOT EXISTS posts_wallet_address_idx ON posts(wallet_address);

-- Step 5: Update RLS policies to allow wallet-based posting

-- Drop old policies
DROP POLICY IF EXISTS "Authenticated users can insert posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;

-- New policy: Anyone can insert posts (wallet-based)
CREATE POLICY "Anyone can insert posts"
ON posts FOR INSERT
WITH CHECK (true);

-- New policy: Anyone can update posts (we'll add wallet verification in the app)
CREATE POLICY "Anyone can update posts"
ON posts FOR UPDATE
USING (true)
WITH CHECK (true);

-- New policy: Anyone can delete posts (optional, you may want to remove this)
CREATE POLICY "Anyone can delete posts"
ON posts FOR DELETE
USING (true);

-- Optional: Add a check to ensure either user_id or wallet_address is provided
-- ALTER TABLE posts ADD CONSTRAINT posts_identity_check 
-- CHECK (user_id IS NOT NULL OR wallet_address IS NOT NULL);

-- Set default category for existing posts without one
UPDATE posts SET category = 'other' WHERE category IS NULL;

-- Make category NOT NULL with default
ALTER TABLE posts ALTER COLUMN category SET DEFAULT 'other';
ALTER TABLE posts ALTER COLUMN category SET NOT NULL;

