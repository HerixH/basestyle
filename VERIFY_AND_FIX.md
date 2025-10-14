# ✅ Complete Database Fix & Verification

## Current Issue
Your database is missing the `category` column and possibly other updates needed for the wallet-based system.

## 🚀 Complete Fix (Run This)

### Step 1: Copy This SQL
Copy the entire contents from **`COMPLETE_DATABASE_FIX.sql`** or copy this:

```sql
-- Add wallet_address column (if missing)
DO $$ 
BEGIN
    ALTER TABLE posts ADD COLUMN wallet_address TEXT;
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- Add category column (if missing)
DO $$ 
BEGIN
    ALTER TABLE posts ADD COLUMN category TEXT DEFAULT 'other';
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- Set category for existing posts
UPDATE posts SET category = 'other' WHERE category IS NULL;

-- Make category NOT NULL with default
DO $$ 
BEGIN
    ALTER TABLE posts ALTER COLUMN category SET DEFAULT 'other';
    ALTER TABLE posts ALTER COLUMN category SET NOT NULL;
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- Make user_id optional
DO $$ 
BEGIN
    ALTER TABLE posts ALTER COLUMN user_id DROP NOT NULL;
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- Remove foreign key
DO $$ 
BEGIN
    ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_user_id_fkey;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- Drop all policies
DROP POLICY IF EXISTS "Authenticated users can insert posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
DROP POLICY IF EXISTS "Anyone can insert posts" ON posts;
DROP POLICY IF EXISTS "Anyone can update posts" ON posts;
DROP POLICY IF EXISTS "Anyone can delete posts" ON posts;
DROP POLICY IF EXISTS "Anyone can read posts" ON posts;

-- Create new policies
CREATE POLICY "Anyone can read posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update posts" ON posts FOR UPDATE USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS posts_wallet_address_idx ON posts(wallet_address);
CREATE INDEX IF NOT EXISTS posts_timestamp_idx ON posts(timestamp DESC);
CREATE INDEX IF NOT EXISTS posts_category_idx ON posts(category);
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts(user_id);
```

### Step 2: Run in Supabase
1. Open Supabase SQL Editor
2. Paste the SQL
3. Click "Run"

### Step 3: Verify It Worked
Run this query to check your table structure:

```sql
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'posts'
ORDER BY ordinal_position;
```

You should see:
- ✅ `id` (uuid)
- ✅ `user_id` (uuid, nullable)
- ✅ `user_name` (text)
- ✅ `activity` (text)
- ✅ `category` (text, default 'other')
- ✅ `image` (text)
- ✅ `timestamp` (bigint)
- ✅ `nft_count` (integer)
- ✅ `usdc_earned` (integer)
- ✅ `wallet_address` (text)
- ✅ `created_at` (timestamp)

### Step 4: Test Your App
1. Refresh your browser
2. Connect wallet
3. Create a post
4. ✅ Should work now!

## 🔍 If Still Having Issues

### Check Current Schema
```sql
\d posts
```

### Check Policies
```sql
SELECT * FROM pg_policies WHERE tablename = 'posts';
```

### Check for Errors
Look at browser console (F12) for detailed error messages

## 🆘 Nuclear Option (Last Resort)

If nothing works, you can recreate the table fresh:

```sql
-- ⚠️ WARNING: Deletes all posts!
DROP TABLE IF EXISTS posts CASCADE;

-- Then run supabase-posts-setup-wallet.sql
```

## ✅ Success Checklist

After running the fix:
- [ ] No SQL errors
- [ ] Table has all columns
- [ ] Policies are updated
- [ ] Can create posts in app
- [ ] Posts appear in feed
- [ ] Can mint NFTs
- [ ] Can send USDC

---

**Run the COMPLETE_DATABASE_FIX.sql and everything should work!** 🚀

