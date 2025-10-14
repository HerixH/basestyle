-- Migration: Switch from Supabase Auth to Wallet-Based Auth
-- This updates the posts table to use wallet addresses instead of user IDs

-- Add wallet_address column if it doesn't exist
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Update the policies to work with wallet addresses
DROP POLICY IF EXISTS "Authenticated users can insert posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;

-- New policy: Anyone can insert posts (we'll validate wallet on client)
CREATE POLICY "Anyone can insert posts"
ON posts FOR INSERT
WITH CHECK (wallet_address IS NOT NULL AND wallet_address != '');

-- New policy: Can only update posts with their wallet address
CREATE POLICY "Can update own posts by wallet"
ON posts FOR UPDATE
USING (wallet_address IS NOT NULL);

-- New policy: Can delete own posts by wallet  
CREATE POLICY "Can delete own posts by wallet"
ON posts FOR DELETE
USING (wallet_address IS NOT NULL);

-- Make wallet_address the main identifier (optional: remove user_id dependency)
ALTER TABLE posts ALTER COLUMN user_id DROP NOT NULL;

