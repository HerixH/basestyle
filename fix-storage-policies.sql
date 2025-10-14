-- Fix Storage Policies for Wallet-Based Auth
-- Run this in Supabase SQL Editor to allow uploads without Supabase auth

-- Drop existing policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- 1. Allow public read access (anyone can view images)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'post-images');

-- 2. Allow anyone to upload (including anon users)
-- This is needed because users authenticate via wallet, not Supabase
CREATE POLICY "Anyone can upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'post-images');

-- 3. Allow anyone to update
CREATE POLICY "Anyone can update"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'post-images');

-- 4. Allow anyone to delete
CREATE POLICY "Anyone can delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'post-images');

-- Verify the bucket exists and is public
SELECT 
  id,
  name,
  public,
  file_size_limit
FROM storage.buckets 
WHERE id = 'post-images';

