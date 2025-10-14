# Database Migration Guide - Wallet-Based Posts

## Issue
Your app has been updated to use wallet addresses instead of authentication-based user IDs, but the database schema still expects `user_id`. This causes post creation to fail.

## Solution
Run the migration script to update your database schema.

## Steps to Fix

### Option 1: Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Open https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Migration**
   - Copy the contents of `supabase-wallet-based-posts.sql`
   - Paste into the SQL editor
   - Click "Run" or press `Ctrl+Enter`

4. **Verify Success**
   - Check for success message
   - No errors should appear

### Option 2: Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push --db-url "your-database-connection-string" --file supabase-wallet-based-posts.sql
```

## What This Migration Does

1. ✅ **Adds `wallet_address` column** - Stores user's wallet address
2. ✅ **Makes `user_id` nullable** - Backwards compatible with old posts
3. ✅ **Removes auth constraint** - No longer requires authentication
4. ✅ **Updates RLS policies** - Anyone can post (wallet-based)
5. ✅ **Adds indexes** - Faster queries on wallet_address
6. ✅ **Sets category defaults** - Ensures all posts have a category

## After Running Migration

Your app will work correctly:
- ✅ Posts created with wallet addresses
- ✅ No authentication required for posting
- ✅ Search and categories work properly
- ✅ NFT minting works with wallet addresses

## Rollback (If Needed)

If something goes wrong, you can rollback:

```sql
-- Rollback: Remove wallet_address column
ALTER TABLE posts DROP COLUMN IF EXISTS wallet_address;

-- Restore user_id requirement
ALTER TABLE posts ALTER COLUMN user_id SET NOT NULL;

-- Restore old policies (see supabase-posts-setup.sql)
```

## Testing After Migration

1. **Clear browser cache** and reload the app
2. **Connect your wallet**
3. **Try creating a post**
4. **Verify it appears in the feed**
5. **Try minting NFT and sending USDC**

## Common Issues

### "relation posts does not exist"
→ Run the original `supabase-posts-setup.sql` first to create the table

### "RLS policy error"
→ Make sure all old policies are dropped before creating new ones

### "Posts not appearing"
→ Check browser console for errors
→ Verify real-time subscription is working

## Alternative: Fresh Schema

If you prefer to start fresh with a clean schema:

```sql
-- Drop the entire table (WARNING: deletes all data)
DROP TABLE IF EXISTS posts CASCADE;

-- Then run the new schema from supabase-posts-setup-wallet.sql
```

