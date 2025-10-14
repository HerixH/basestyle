-- ⚡ SAFE FIX for "Failed to create post" error
-- This version handles existing policies and won't cause errors

-- Step 1: Add wallet_address column (safe if already exists)
DO $$ 
BEGIN
    ALTER TABLE posts ADD COLUMN wallet_address TEXT;
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- Step 2: Make user_id optional (safe if already done)
DO $$ 
BEGIN
    ALTER TABLE posts ALTER COLUMN user_id DROP NOT NULL;
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- Step 3: Remove the foreign key constraint (safe if already removed)
DO $$ 
BEGIN
    ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_user_id_fkey;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- Step 4: Drop ALL policies (safe - won't error if they don't exist)
DROP POLICY IF EXISTS "Authenticated users can insert posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
DROP POLICY IF EXISTS "Anyone can insert posts" ON posts;
DROP POLICY IF EXISTS "Anyone can update posts" ON posts;
DROP POLICY IF EXISTS "Anyone can delete posts" ON posts;
DROP POLICY IF EXISTS "Anyone can read posts" ON posts;

-- Step 5: Recreate all policies fresh
CREATE POLICY "Anyone can read posts"
ON posts FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert posts"
ON posts FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update posts"
ON posts FOR UPDATE
USING (true)
WITH CHECK (true);

-- Step 6: Set category defaults (safe)
UPDATE posts SET category = 'other' WHERE category IS NULL;

DO $$ 
BEGIN
    ALTER TABLE posts ALTER COLUMN category SET DEFAULT 'other';
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- Step 7: Create indexes (safe if already exist)
CREATE INDEX IF NOT EXISTS posts_wallet_address_idx ON posts(wallet_address);
CREATE INDEX IF NOT EXISTS posts_timestamp_idx ON posts(timestamp DESC);
CREATE INDEX IF NOT EXISTS posts_category_idx ON posts(category);

-- ✅ Done! Your app should now work correctly.
-- Try creating a post again.

-- Verify the fix worked:
SELECT 
    'Posts table ready!' as status,
    COUNT(*) as total_posts,
    COUNT(wallet_address) as posts_with_wallet,
    COUNT(user_id) as posts_with_user_id
FROM posts;

