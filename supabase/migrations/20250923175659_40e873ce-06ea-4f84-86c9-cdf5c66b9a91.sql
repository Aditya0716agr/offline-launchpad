-- Add new fields to startups table for comprehensive startup submissions
ALTER TABLE public.startups 
ADD COLUMN tagline TEXT,
ADD COLUMN cover_image_url TEXT,
ADD COLUMN gallery_images TEXT[],
ADD COLUMN city TEXT,
ADD COLUMN state_region TEXT,
ADD COLUMN full_address TEXT,
ADD COLUMN email_contact TEXT,
ADD COLUMN phone_number TEXT,
ADD COLUMN social_instagram TEXT,
ADD COLUMN social_facebook TEXT,
ADD COLUMN social_linkedin TEXT,
ADD COLUMN social_twitter TEXT,
ADD COLUMN team_size TEXT,
ADD COLUMN stage TEXT,
ADD COLUMN looking_for TEXT[];

-- Create storage buckets for startup assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('startup-logos', 'startup-logos', true);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('startup-covers', 'startup-covers', true);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('startup-gallery', 'startup-gallery', true);

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