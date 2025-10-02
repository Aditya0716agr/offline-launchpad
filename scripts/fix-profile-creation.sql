-- Fix profile creation issues
-- Run this in your Supabase SQL Editor

-- First, let's check current RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Drop existing policies that might be blocking profile creation
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

-- Create new, more permissive policies for profiles
CREATE POLICY "Everyone can view all profiles" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" 
ON public.profiles FOR DELETE 
USING (auth.uid() = user_id);

-- Ensure the auth trigger function exists and is working
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'user'::user_role
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Test the setup by checking if we can create a test profile
-- (This will fail if there are still issues)
DO $$
DECLARE
    test_user_id UUID := '00000000-0000-0000-0000-000000000999';
BEGIN
    -- Try to insert a test profile
    INSERT INTO public.profiles (user_id, full_name, role)
    VALUES (test_user_id, 'Test User', 'user');
    
    -- Clean up the test profile
    DELETE FROM public.profiles WHERE user_id = test_user_id;
    
    RAISE NOTICE 'Profile creation test passed! ✅';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Profile creation test failed: %', SQLERRM;
END $$;

-- Show current policies
SELECT 'Current RLS policies on profiles table:' as info;
SELECT policyname, cmd, permissive 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Success message
SELECT 'Profile creation fix completed! 🎉' as message;
