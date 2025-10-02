-- Safe migration script that handles existing policies
-- Run this in your Supabase SQL Editor

-- Step 1: Drop all existing policies first
DROP POLICY IF EXISTS "Only admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Approved startups are viewable by everyone" ON public.startups;
DROP POLICY IF EXISTS "Founders can insert their own startups" ON public.startups;
DROP POLICY IF EXISTS "Founders can update their own startups" ON public.startups;
DROP POLICY IF EXISTS "Founders and admins can delete startups" ON public.startups;
DROP POLICY IF EXISTS "Everyone can view all startups" ON public.startups;
DROP POLICY IF EXISTS "Authenticated users can add startups" ON public.startups;
DROP POLICY IF EXISTS "Users can update their own startups" ON public.startups;
DROP POLICY IF EXISTS "Users can delete their own startups" ON public.startups;

-- Step 2: Add role column to profiles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'role'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';
    END IF;
END $$;

-- Step 3: Update any existing profiles to have 'user' role
UPDATE profiles SET role = 'user' WHERE role IS NULL OR role = 'founder';

-- Step 4: Create user_role enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'admin');
    END IF;
END $$;

-- Step 5: Now we can safely update the role column to use the enum
ALTER TABLE public.profiles ALTER COLUMN role TYPE user_role USING role::user_role;

-- Step 6: Update startup status to auto-approve all existing startups
UPDATE startups SET status = 'approved' WHERE status = 'pending';

-- Step 7: Create new open policies for profiles
CREATE POLICY "Everyone can view all profiles" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" 
ON public.profiles FOR DELETE 
USING (auth.uid() = user_id);

-- Step 8: Create new open policies for categories
CREATE POLICY "Everyone can view categories" 
ON public.categories FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage categories" 
ON public.categories FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Step 9: Create new open policies for startups
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

-- Step 10: Update the auth trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'user'::user_role -- Everyone starts as a regular user
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Step 11: Update the startup table to auto-approve new startups
ALTER TABLE public.startups ALTER COLUMN status SET DEFAULT 'approved';

-- Step 12: Add any missing categories if they don't exist
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
SELECT 'Safe migration to open setup completed successfully! 🎉 Everyone can now add startups!' as message;
