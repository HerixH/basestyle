CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT,
  activity TEXT NOT NULL,
  image TEXT,
  timestamp BIGINT NOT NULL,
  nft_count INTEGER DEFAULT 0,
  usdc_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read posts"
ON posts FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
ON posts FOR DELETE
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS posts_timestamp_idx ON posts(timestamp DESC);
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts(user_id);

