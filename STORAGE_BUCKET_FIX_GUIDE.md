# Storage Bucket Fix Guide

## Problem
Startup submissions are failing with "bucket not found" error because the required Supabase storage buckets haven't been created yet.

## Solution

### Option 1: Manual Setup via Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Sign in and select your project

2. **Navigate to Storage**
   - Click on "Storage" in the left sidebar
   - Click "New bucket"

3. **Create the required buckets:**

   **Bucket 1: startup-logos**
   - Name: `startup-logos`
   - Public: ✅ Yes
   - File size limit: 5MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`

   **Bucket 2: startup-covers**
   - Name: `startup-covers`
   - Public: ✅ Yes
   - File size limit: 10MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`

   **Bucket 3: startup-gallery**
   - Name: `startup-gallery`
   - Public: ✅ Yes
   - File size limit: 10MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`

4. **Set up Storage Policies**
   - Go to Storage > Policies
   - For each bucket, create these policies:

   **For startup-logos bucket:**
   ```sql
   -- Allow public read access
   CREATE POLICY "Startup logos are publicly accessible" 
   ON storage.objects 
   FOR SELECT 
   USING (bucket_id = 'startup-logos');

   -- Allow authenticated users to upload
   CREATE POLICY "Authenticated users can upload startup logos" 
   ON storage.objects 
   FOR INSERT 
   WITH CHECK (bucket_id = 'startup-logos' AND auth.uid() IS NOT NULL);

   -- Allow users to update their own files
   CREATE POLICY "Users can update their startup logos" 
   ON storage.objects 
   FOR UPDATE 
   USING (bucket_id = 'startup-logos' AND auth.uid() IS NOT NULL);

   -- Allow users to delete their own files
   CREATE POLICY "Users can delete their startup logos" 
   ON storage.objects 
   FOR DELETE 
   USING (bucket_id = 'startup-logos' AND auth.uid() IS NOT NULL);
   ```

   **Repeat the same policies for:**
   - `startup-covers` bucket
   - `startup-gallery` bucket

### Option 2: SQL Script Setup

1. **Go to SQL Editor in Supabase Dashboard**
2. **Run the SQL script** from `scripts/setup-storage-buckets.sql`
3. **Verify buckets were created** by checking the Storage section

### Option 3: JavaScript Script Setup

1. **Update the script** `scripts/setup-storage-buckets.js` with your Supabase credentials
2. **Run the script** using Node.js:
   ```bash
   node scripts/setup-storage-buckets.js
   ```

## Verification

After setting up the buckets:

1. **Check Storage section** in Supabase Dashboard
2. **Verify all three buckets exist:**
   - startup-logos
   - startup-covers
   - startup-gallery

3. **Test startup submission** again
4. **Check browser console** for any remaining errors

## Troubleshooting

### If buckets still don't work:

1. **Check bucket names** - they must be exactly:
   - `startup-logos`
   - `startup-covers`
   - `startup-gallery`

2. **Verify bucket permissions** - all buckets should be public

3. **Check storage policies** - make sure policies are created for each bucket

4. **Test with a simple upload** in Supabase Storage interface

### If you get permission errors:

1. **Check RLS policies** on storage.objects table
2. **Ensure policies allow authenticated users** to upload
3. **Verify bucket_id matches** in policy conditions

## Contact Support

If you continue to have issues:
- Email: hertofhelp@gmail.com
- Include error messages and screenshots
- Mention which setup method you tried

## Files Modified

The following files have been updated with better error handling:
- `src/components/startup/QuickStartupModal.tsx`
- `src/components/startup/AddStartupModal.tsx`
- `src/components/startup/StartupSubmissionModal.tsx`

These now provide clearer error messages when buckets are missing.

---

**Last Updated**: January 2024
