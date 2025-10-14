# 🗄️ Database Setup Guide

## Quick Setup (5 minutes)

Your posts need to be saved to a database so they persist when you refresh the page. Follow these steps:

### Step 1: Create the Posts Table

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Select your Baselifytle project**
3. **Click "SQL Editor"** in the left sidebar
4. **Click "New query"**
5. **Copy and paste this SQL code**:

```sql
-- Create posts table
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

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read posts
CREATE POLICY "Anyone can read posts"
ON posts FOR SELECT
USING (true);

-- Policy: Authenticated users can insert their own posts
CREATE POLICY "Authenticated users can insert posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own posts
CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own posts
CREATE POLICY "Users can delete own posts"
ON posts FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS posts_timestamp_idx ON posts(timestamp DESC);
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts(user_id);
```

6. **Click "Run"** (or press `Ctrl+Enter` / `Cmd+Enter`)

### Step 2: Enable Realtime (Optional but Recommended)

This allows posts to update in real-time without refreshing:

1. In Supabase Dashboard, go to **Database** → **Replication**
2. Find the `posts` table
3. **Enable replication** for the `posts` table
4. Click **Save**

### Step 3: Test It!

1. **Refresh your app** in the browser
2. **Create a new post** with or without an image
3. **Refresh the page** - your post should still be there! ✨
4. **Open in another browser/tab** - you should see the same posts

## ✅ What This Does

- **Persists posts**: Posts are saved to the database and survive page refreshes
- **Real-time updates**: When anyone creates a post, everyone sees it instantly
- **Secure**: Only authenticated users can create posts, and only see their own posts for editing
- **Fast**: Indexed for quick loading even with thousands of posts

## 🔧 Troubleshooting

### Error: "relation posts does not exist"
→ Run the SQL script from Step 1

### Posts not updating in real-time
→ Enable replication in Step 2

### "new row violates row-level security policy"
→ The SQL script includes all necessary policies, re-run Step 1

## 🎉 You're Done!

Your app now has full database persistence. Posts will be saved and load automatically!

