-- Clean up old posts from before wallet authentication migration
-- This will remove posts that don't have wallet_address (old system)

-- First, let's see what we're about to delete
SELECT 
  id, 
  user_name, 
  activity, 
  wallet_address, 
  created_at 
FROM posts 
WHERE wallet_address IS NULL;

-- Delete old posts without wallet addresses
DELETE FROM posts 
WHERE wallet_address IS NULL;

-- Verify the cleanup
SELECT COUNT(*) as remaining_posts FROM posts;
SELECT COUNT(*) as posts_with_wallet FROM posts WHERE wallet_address IS NOT NULL;
