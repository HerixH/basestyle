-- Safe migration: Add wallet_address column (if it doesn't exist)
-- Run this to update your posts table for wallet-based auth

-- Add wallet_address column
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Make user_id optional (since we're using wallet addresses now)
ALTER TABLE posts 
ALTER COLUMN user_id DROP NOT NULL;

-- That's it! The policies should already be set from your initial setup
-- Your existing "Anyone can insert posts" policy will work for wallet-based auth

