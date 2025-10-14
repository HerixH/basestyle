# Quick Fix: Image Upload Not Working

## Problem
Images aren't showing in posts because the Supabase storage bucket doesn't exist yet.

## Solution (2 minutes)

### Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard: [https://app.supabase.com](https://app.supabase.com)

2. Click on your project

3. In the left sidebar, click **"Storage"**

4. Click **"New bucket"** button

5. Fill in the details:
   - **Name**: `post-images` (exactly this name!)
   - **Public bucket**: ✅ **CHECK THIS BOX** (very important!)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/*`

6. Click **"Create bucket"**

### Step 2: Test It

1. Go back to your app
2. Try creating a new post with an image
3. The image should now upload and display! ✅

## What We Fixed

1. **Rate Limiting** ✅
   - Added debouncing to prevent too many API calls
   - Wallet info only saves once per connection
   - Checks if data is already saved before updating

2. **Image Upload Error Handling** ✅
   - Shows clear error if upload fails
   - Prevents posting if image upload fails
   - Better error messages

## Still Having Issues?

### If images still don't show:
1. Check browser console for errors
2. Make sure the bucket is named exactly `post-images`
3. Make sure "Public bucket" is enabled
4. Try refreshing the page

### If rate limit errors continue:
1. Wait 60 seconds
2. Refresh the page
3. The debouncing should prevent future rate limits

## Need Help?

See the full setup guide in `SUPABASE_SETUP.md` for detailed storage policies and configuration.

