-- Migration script to convert existing setup to open setup
-- Run this in your Supabase SQL Editor

-- Step 1: Update user roles enum to remove 'founder'
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Step 2: Update existing profiles to be 'user' instead of 'founder'
UPDATE profiles SET role = 'user' WHERE role = 'founder';

-- Step 3: Update startup status to auto-approve all existing startups
UPDATE startups SET status = 'approved' WHERE status = 'pending';

-- Step 4: Drop existing restrictive policies
DROP POLICY IF EXISTS "Approved startups are viewable by everyone" ON public.startups;
DROP POLICY IF EXISTS "Founders can insert their own startups" ON public.startups;
DROP POLICY IF EXISTS "Founders can update their own startups" ON public.startups;
DROP POLICY IF EXISTS "Founders and admins can delete startups" ON public.startups;

-- Step 5: Create new open policies for startups
CREATE POLICY "Everyone can view all startups" 
ON public.startups FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can add startups" 
ON public.startups FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own startups" 
ON public.startups FOR UPDATE 
USING (founder_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can delete their own startups" 
ON public.startups FOR DELETE 
USING (founder_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Step 6: Update the auth trigger function to create users as 'user' role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'user' -- Everyone starts as a regular user
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Step 7: Update the startup table to auto-approve new startups
ALTER TABLE public.startups ALTER COLUMN status SET DEFAULT 'approved';

-- Step 8: Add any missing categories if they don't exist
INSERT INTO public.categories (name, slug, description) VALUES
  ('Food & Beverage', 'food-beverage', 'Restaurants, cafes, food delivery, and beverage brands'),
  ('Health & Wellness', 'health-wellness', 'Fitness, healthcare, beauty, and wellness services'),
  ('Retail & Fashion', 'retail-fashion', 'Clothing, accessories, home goods, and retail stores'),
  ('Services', 'services', 'Professional services, consultancy, and local service providers'),
  ('Beauty & Personal Care', 'beauty-personal-care', 'Cosmetics, skincare, and personal care services'),
  ('Home & Lifestyle', 'home-lifestyle', 'Interior design, home services, and lifestyle brands'),
  ('Education & Training', 'education-training', 'Educational services, training programs, and workshops'),
  ('Entertainment', 'entertainment', 'Events, media, gaming, and entertainment services'),
  ('Travel & Hospitality', 'travel-hospitality', 'Hotels, travel services, and hospitality businesses'),
  ('Sustainable Products', 'sustainable-products', 'Eco-friendly and sustainable product companies'),
  ('Other', 'other', 'Startups that don''t fit into other categories')
ON CONFLICT (name) DO NOTHING;

-- Success message
SELECT 'Migration to open setup completed successfully! 🎉 Everyone can now add startups!' as message;
