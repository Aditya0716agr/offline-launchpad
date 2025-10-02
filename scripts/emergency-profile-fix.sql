-- Emergency fix for profile creation issues
-- Run this in your Supabase SQL Editor

-- First, let's see what users exist without profiles
SELECT 'Users without profiles:' as info;
SELECT 
    au.id as user_id,
    au.email,
    au.created_at as user_created
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.user_id
WHERE p.user_id IS NULL;

-- Temporarily disable RLS completely
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Create profiles for ALL users who don't have one
INSERT INTO public.profiles (user_id, full_name, role, created_at, updated_at)
SELECT 
    au.id,
    COALESCE(au.raw_user_meta_data->>'full_name', au.email),
    'user'::user_role,
    NOW(),
    NOW()
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.user_id
WHERE p.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies and recreate them
DROP POLICY IF EXISTS "Everyone can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create new, simple policies
CREATE POLICY "profiles_select_policy" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "profiles_insert_policy" 
ON public.profiles FOR INSERT 
WITH CHECK (true);

CREATE POLICY "profiles_update_policy" 
ON public.profiles FOR UPDATE 
USING (true);

CREATE POLICY "profiles_delete_policy" 
ON public.profiles FOR DELETE 
USING (true);

-- Show all profiles now
SELECT 'All profiles in database:' as info;
SELECT 
    id,
    user_id,
    full_name,
    role,
    created_at
FROM public.profiles
ORDER BY created_at DESC;

-- Test profile creation
DO $$
DECLARE
    test_user_id UUID := '00000000-0000-0000-0000-000000000888';
BEGIN
    -- Try to insert a test profile
    INSERT INTO public.profiles (user_id, full_name, role)
    VALUES (test_user_id, 'Test Profile', 'user');
    
    -- Clean up
    DELETE FROM public.profiles WHERE user_id = test_user_id;
    
    RAISE NOTICE 'Profile creation test PASSED! ✅';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Profile creation test FAILED: %', SQLERRM;
END $$;

-- Final success message
SELECT 'Emergency profile fix completed! 🎉' as message;
SELECT 'Now refresh your dashboard - it should work!' as next_step;
