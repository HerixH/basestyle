-- Clean posts table schema with wallet-based authentication
-- Use this for fresh installations

-- Drop existing table if starting fresh (WARNING: deletes all data)
-- DROP TABLE IF EXISTS posts CASCADE;

-- Create posts table with wallet addresses
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT,
  user_name TEXT NOT NULL,
  activity TEXT NOT NULL,
  category TEXT DEFAULT 'other' NOT NULL,
  image TEXT,
  timestamp BIGINT NOT NULL,
  nft_count INTEGER DEFAULT 0,
  usdc_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read posts
CREATE POLICY "Anyone can read posts"
ON posts FOR SELECT
USING (true);

-- Policy: Anyone can insert posts (wallet-based, verification in app)
CREATE POLICY "Anyone can insert posts"
ON posts FOR INSERT
WITH CHECK (true);

-- Policy: Anyone can update posts (verification in app layer)
CREATE POLICY "Anyone can update posts"
ON posts FOR UPDATE
USING (true)
WITH CHECK (true);

-- Policy: Anyone can delete posts
CREATE POLICY "Anyone can delete posts"
ON posts FOR DELETE
USING (true);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS posts_timestamp_idx ON posts(timestamp DESC);
CREATE INDEX IF NOT EXISTS posts_wallet_address_idx ON posts(wallet_address);
CREATE INDEX IF NOT EXISTS posts_category_idx ON posts(category);

-- Create full-text search index for activity
CREATE INDEX IF NOT EXISTS posts_activity_search_idx ON posts USING gin(to_tsvector('english', activity));

-- Optional: Add constraint to ensure wallet_address is provided
-- ALTER TABLE posts ADD CONSTRAINT posts_wallet_check 
-- CHECK (wallet_address IS NOT NULL AND wallet_address != '');

