-- Comments and Likes schema for wallet-based posts

-- Ensure gen_random_uuid() is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  wallet_address TEXT,
  user_name TEXT,
  content TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table (unique like per wallet per post)
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (post_id, wallet_address)
);

-- Enable RLS (optional). Keep permissive policies to match wallet-based flow
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can read
DO $$ BEGIN
  CREATE POLICY "read_comments" ON comments FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "read_post_likes" ON post_likes FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Anyone can insert (wallet-address keyed). In production, tighten with auth
DO $$ BEGIN
  CREATE POLICY "insert_comments" ON comments FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "insert_post_likes" ON post_likes FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Allow deletes from same wallet (best-effort without auth). Optional
DO $$ BEGIN
  CREATE POLICY "delete_own_comment" ON comments FOR DELETE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "delete_own_like" ON post_likes FOR DELETE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON comments(post_id);
CREATE INDEX IF NOT EXISTS post_likes_post_id_idx ON post_likes(post_id);

