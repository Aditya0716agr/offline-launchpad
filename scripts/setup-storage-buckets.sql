-- Setup Storage Buckets for Startup Submissions
-- Run this script in your Supabase SQL Editor to create the required storage buckets

-- Create storage buckets for startup assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('startup-logos', 'startup-logos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('startup-covers', 'startup-covers', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('startup-gallery', 'startup-gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Startup logos are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload startup logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their startup logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their startup logos" ON storage.objects;

DROP POLICY IF EXISTS "Startup covers are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload startup covers" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their startup covers" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their startup covers" ON storage.objects;

DROP POLICY IF EXISTS "Startup gallery images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their gallery images" ON storage.objects;

-- Storage policies for startup logos
CREATE POLICY "Startup logos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'startup-logos');

CREATE POLICY "Authenticated users can upload startup logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'startup-logos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their startup logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'startup-logos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their startup logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'startup-logos' AND auth.uid() IS NOT NULL);

-- Storage policies for startup covers
CREATE POLICY "Startup covers are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'startup-covers');

CREATE POLICY "Authenticated users can upload startup covers" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'startup-covers' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their startup covers" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'startup-covers' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their startup covers" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'startup-covers' AND auth.uid() IS NOT NULL);

-- Storage policies for startup gallery
CREATE POLICY "Startup gallery images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'startup-gallery');

CREATE POLICY "Authenticated users can upload gallery images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'startup-gallery' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their gallery images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'startup-gallery' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their gallery images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'startup-gallery' AND auth.uid() IS NOT NULL);

-- Verify buckets were created
SELECT id, name, public FROM storage.buckets WHERE id IN ('startup-logos', 'startup-covers', 'startup-gallery');
