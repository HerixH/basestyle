# 🔧 Fix "Failed to create post" Error

## Problem
Your app is trying to create posts with wallet addresses, but the database schema still expects authenticated user IDs. This causes the error: **"Failed to create post. Please try again."**

## ⚡ Quick Fix (2 Minutes)

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New query"**

### Step 2: Copy & Run This SQL
Copy the entire contents of **`FIX_DATABASE_NOW.sql`** and paste it into the SQL editor.

Or copy this directly:

```sql
-- Add wallet_address column
ALTER TABLE posts ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Make user_id optional
ALTER TABLE posts ALTER COLUMN user_id DROP NOT NULL;

-- Remove foreign key constraint
DO $$ 
BEGIN
    ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_user_id_fkey;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- Drop old policies
DROP POLICY IF EXISTS "Authenticated users can insert posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;

-- Create new policies
CREATE POLICY "Anyone can insert posts"
ON posts FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update posts"
ON posts FOR UPDATE
USING (true)
WITH CHECK (true);

-- Set category defaults
UPDATE posts SET category = 'other' WHERE category IS NULL;
ALTER TABLE posts ALTER COLUMN category SET DEFAULT 'other';

-- Create index
CREATE INDEX IF NOT EXISTS posts_wallet_address_idx ON posts(wallet_address);
```

### Step 3: Click "Run"
Press the **Run** button or `Ctrl+Enter`

### Step 4: Test Your App
1. Refresh your browser
2. Connect your wallet
3. Try creating a post
4. ✅ Should work now!

## What This Fix Does

- ✅ Adds `wallet_address` column to store user wallet addresses
- ✅ Makes `user_id` optional (for backwards compatibility)
- ✅ Removes authentication requirement
- ✅ Updates security policies to allow wallet-based posting
- ✅ Ensures all posts have a category
- ✅ Adds indexes for better performance

## Verify It Worked

After running the migration:

1. **Check the table structure**:
   ```sql
   SELECT column_name, data_type, is_nullable 
   FROM information_schema.columns 
   WHERE table_name = 'posts';
   ```

2. **Check policies**:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'posts';
   ```

3. **Try creating a post** in your app

## Still Having Issues?

### Error: "table posts does not exist"
→ Run `supabase-posts-setup-wallet.sql` first to create the table

### Error: "permission denied"
→ Make sure you're running this as the Supabase project owner

### Error: "column already exists"
→ That's OK! The script uses `IF NOT EXISTS` to be safe

### Posts still not working?
→ Check browser console (F12) for detailed error messages
→ Check Supabase logs in the dashboard

## Need to Start Fresh?

If you want to completely recreate the table:

```sql
-- ⚠️ WARNING: This deletes all existing posts!
DROP TABLE IF EXISTS posts CASCADE;
```

Then run `supabase-posts-setup-wallet.sql` to create a fresh table.

---

**After running this migration, your app will work perfectly!** 🎉

