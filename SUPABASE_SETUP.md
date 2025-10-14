# Supabase Setup Guide for Image Upload & NFT Minting

## 1. Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Configure the bucket:
   - **Name**: `post-images`
   - **Public bucket**: ✅ Enable (so images are publicly accessible)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/*`
5. Click **"Create bucket"**

## 2. Set Up Storage Policies

After creating the bucket, set up these policies:

### Allow Public Read Access
```sql
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');
```

### Allow Authenticated Users to Upload
```sql
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'post-images'
  AND auth.role() = 'authenticated'
);
```

### Allow Users to Delete Their Own Images
```sql
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'post-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## 3. How It Works

### Image Upload Flow
1. User selects an image in the post form
2. Image preview is shown
3. When posting, image is uploaded to Supabase Storage
4. Public URL is generated and saved with the post
5. Image is displayed in the post feed

### NFT Minting (Future Enhancement)
- Images can be minted as NFTs on Base
- Users receive NFT badges with the image
- NFTs are viewable on OpenSea and other marketplaces

## 4. Testing

1. Create a post with an image
2. Check that the image appears in the preview
3. Submit the post
4. Verify the image displays in the feed
5. Check Supabase Storage to see the uploaded file

## 5. Production Considerations

- **Image Optimization**: Consider resizing images before upload
- **CDN**: Use Supabase CDN for faster image delivery
- **IPFS Integration**: For permanent NFT storage, integrate IPFS
- **Moderation**: Implement image moderation/filtering
- **Compression**: Compress images client-side before upload

