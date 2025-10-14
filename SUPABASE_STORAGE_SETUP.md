# 🖼️ Supabase Storage Setup - Fix Image Upload

Your image upload is failing because the storage bucket doesn't exist yet. Follow these steps:

## Quick Fix (2 minutes)

### Step 1: Create Storage Bucket

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your Baselifestyle project**
3. **Click "Storage"** in the left sidebar
4. **Click "New bucket"**
5. **Enter bucket details**:
   - Name: `post-images`
   - ✅ Check "Public bucket" (so images can be viewed publicly)
   - Click "Create bucket"

### Step 2: Set Storage Policies

After creating the bucket, you need to set policies:

1. **Click on the `post-images` bucket**
2. **Click "Policies"** tab
3. **Click "New Policy"**
4. **Select "For full customization"**

#### Policy 1: Allow Public Read (View Images)
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'post-images');
```

#### Policy 2: Allow Authenticated Upload
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'post-images');
```

#### Policy 3: Allow Users to Update Their Own Images
```sql
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'post-images');
```

#### Policy 4: Allow Users to Delete Their Own Images
```sql
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'post-images');
```

### Alternative: One-Click SQL Setup

Or run this SQL in the SQL Editor to set up everything at once:

```sql
-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'post-images');

-- Policy to allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'post-images');

-- Policy to allow users to update their own files
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'post-images');

-- Policy to allow users to delete their own files
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'post-images');
```

## Test It

1. Go back to your app: https://baselifytle.vercel.app
2. Sign in with your wallet
3. Try posting with an image
4. It should work now! ✅

## Configuration Details

Your app uploads images to:
- **Bucket**: `post-images`
- **Path**: `posts/{wallet-address}-{timestamp}.{ext}`
- **Access**: Public (anyone can view the images)
- **Upload**: Only authenticated users can upload

## Troubleshooting

If it still doesn't work:

1. **Check bucket name**: Make sure it's exactly `post-images` (lowercase, with hyphen)
2. **Check policies**: Make sure all 4 policies are created
3. **Check authentication**: Make sure you're signed in with your wallet
4. **Check file size**: Images must be under 5MB
5. **Check Supabase logs**: Go to Storage → Logs to see errors

## Optional: Set File Size Limits

To prevent abuse, you can set size limits in your Supabase project settings:

1. Go to Settings → Storage
2. Set max file size (default is fine)
3. Set allowed MIME types (image/*, etc.)

