-- ⚡ COMPLETE DATABASE FIX
-- This adds ALL missing columns and fixes policies
-- Safe to run even if some changes were already made

-- Step 1: Add wallet_address column (if missing)
DO $$ 
BEGIN
    ALTER TABLE posts ADD COLUMN wallet_address TEXT;
    RAISE NOTICE 'Added wallet_address column';
EXCEPTION
    WHEN duplicate_column THEN 
        RAISE NOTICE 'wallet_address column already exists';
END $$;

-- Step 2: Add category column (if missing)
DO $$ 
BEGIN
    ALTER TABLE posts ADD COLUMN category TEXT DEFAULT 'other';
    RAISE NOTICE 'Added category column';
EXCEPTION
    WHEN duplicate_column THEN 
        RAISE NOTICE 'category column already exists';
END $$;

-- Step 3: Ensure existing posts have a category
UPDATE posts SET category = 'other' WHERE category IS NULL;

-- Step 4: Make category NOT NULL with default
DO $$ 
BEGIN
    ALTER TABLE posts ALTER COLUMN category SET DEFAULT 'other';
    ALTER TABLE posts ALTER COLUMN category SET NOT NULL;
    RAISE NOTICE 'Set category constraints';
EXCEPTION
    WHEN others THEN 
        RAISE NOTICE 'Category constraints may already exist';
END $$;

-- Step 5: Make user_id optional (for wallet-based posts)
DO $$ 
BEGIN
    ALTER TABLE posts ALTER COLUMN user_id DROP NOT NULL;
    RAISE NOTICE 'Made user_id optional';
EXCEPTION
    WHEN others THEN 
        RAISE NOTICE 'user_id may already be optional';
END $$;

-- Step 6: Remove foreign key constraint
DO $$ 
BEGIN
    ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_user_id_fkey;
    RAISE NOTICE 'Removed user_id foreign key';
EXCEPTION
    WHEN undefined_object THEN 
        RAISE NOTICE 'Foreign key already removed';
END $$;

-- Step 7: Drop ALL existing policies
DROP POLICY IF EXISTS "Authenticated users can insert posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
DROP POLICY IF EXISTS "Anyone can insert posts" ON posts;
DROP POLICY IF EXISTS "Anyone can update posts" ON posts;
DROP POLICY IF EXISTS "Anyone can delete posts" ON posts;
DROP POLICY IF EXISTS "Anyone can read posts" ON posts;

-- Step 8: Create new wallet-based policies
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

-- Step 9: Create all necessary indexes
CREATE INDEX IF NOT EXISTS posts_wallet_address_idx ON posts(wallet_address);
CREATE INDEX IF NOT EXISTS posts_timestamp_idx ON posts(timestamp DESC);
CREATE INDEX IF NOT EXISTS posts_category_idx ON posts(category);
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts(user_id);

-- Step 10: Create full-text search index (if not exists)
DO $$
BEGIN
    CREATE INDEX posts_activity_search_idx ON posts USING gin(to_tsvector('english', activity));
    RAISE NOTICE 'Created full-text search index';
EXCEPTION
    WHEN duplicate_table THEN 
        RAISE NOTICE 'Search index already exists';
END $$;

-- ✅ VERIFICATION - Check your table structure
SELECT 
    'Database migration complete!' as status,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'posts'
ORDER BY ordinal_position;

