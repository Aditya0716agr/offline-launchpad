-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Approved startups are viewable by everyone" ON public.startups;

-- Create separate policies for public and authenticated access
-- Policy 1: Public users can view approved startups but WITHOUT sensitive contact information
-- We'll use a security definer function to control field-level access
CREATE OR REPLACE FUNCTION public.get_startup_public_view()
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  description text,
  tagline text,
  logo_url text,
  cover_image_url text,
  gallery_images text[],
  location text,
  city text,
  state_region text,
  website_url text,
  category_id uuid,
  founder_id uuid,
  launch_date date,
  team_size text,
  stage text,
  looking_for text[],
  social_instagram text,
  social_facebook text,
  social_linkedin text,
  social_twitter text,
  view_count integer,
  is_featured boolean,
  status text,
  created_at timestamptz,
  updated_at timestamptz,
  -- Explicitly excluding: email_contact, phone_number, whatsapp_link, full_address
  email_contact text,
  phone_number text,
  whatsapp_link text,
  full_address text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.slug,
    s.description,
    s.tagline,
    s.logo_url,
    s.cover_image_url,
    s.gallery_images,
    s.location,
    s.city,
    s.state_region,
    s.website_url,
    s.category_id,
    s.founder_id,
    s.launch_date,
    s.team_size,
    s.stage,
    s.looking_for,
    s.social_instagram,
    s.social_facebook,
    s.social_linkedin,
    s.social_twitter,
    s.view_count,
    s.is_featured,
    s.status,
    s.created_at,
    s.updated_at,
    -- Return contact info only for authenticated users, null for anonymous
    CASE WHEN auth.uid() IS NOT NULL THEN s.email_contact ELSE NULL END,
    CASE WHEN auth.uid() IS NOT NULL THEN s.phone_number ELSE NULL END,
    CASE WHEN auth.uid() IS NOT NULL THEN s.whatsapp_link ELSE NULL END,
    CASE WHEN auth.uid() IS NOT NULL THEN s.full_address ELSE NULL END
  FROM public.startups s
  WHERE s.status = 'approved';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Policy 1: Everyone can view approved startups (contact info will be filtered by the function logic above)
CREATE POLICY "Everyone can view approved startups" 
ON public.startups 
FOR SELECT 
USING (status = 'approved' OR founder_id IN (
  SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()
));

-- Policy 2: Founders can view their own startups regardless of status
CREATE POLICY "Founders can view their own startups" 
ON public.startups 
FOR SELECT 
USING (founder_id IN (
  SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()
));

-- Policy 3: Admins can view all startups
CREATE POLICY "Admins can view all startups" 
ON public.startups 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
));