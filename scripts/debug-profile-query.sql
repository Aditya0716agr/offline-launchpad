-- Debug script to check profile query issues
-- Run this in your Supabase SQL Editor

-- Check all users and their profiles
SELECT 'All users and their profiles:' as info;
SELECT 
    au.id as user_id,
    au.email,
    au.created_at as user_created,
    p.id as profile_id,
    p.full_name,
    p.role,
    p.created_at as profile_created
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.user_id
ORDER BY au.created_at DESC;

-- Check if there are any RLS issues
SELECT 'RLS status on profiles table:' as info;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- Check current RLS policies
SELECT 'Current RLS policies:' as info;
SELECT policyname, cmd, permissive, roles, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Test the exact query the frontend uses
SELECT 'Testing frontend query:' as info;
SELECT 
    'Query: SELECT * FROM profiles WHERE user_id = [user_id]' as query_description,
    'This should return the profile if it exists' as expected_result;

-- Show the most recent user (likely you)
SELECT 'Most recent user (likely you):' as info;
SELECT 
    au.id,
    au.email,
    au.created_at
FROM auth.users au
ORDER BY au.created_at DESC
LIMIT 1;

-- Test profile access for the most recent user
DO $$
DECLARE
    recent_user_id UUID;
    profile_exists BOOLEAN;
BEGIN
    -- Get the most recent user ID
    SELECT id INTO recent_user_id 
    FROM auth.users 
    ORDER BY created_at DESC 
    LIMIT 1;
    
    -- Check if profile exists
    SELECT EXISTS(
        SELECT 1 FROM public.profiles 
        WHERE user_id = recent_user_id
    ) INTO profile_exists;
    
    RAISE NOTICE 'Recent user ID: %', recent_user_id;
    RAISE NOTICE 'Profile exists: %', profile_exists;
    
    IF profile_exists THEN
        RAISE NOTICE 'Profile should be accessible! ✅';
    ELSE
        RAISE NOTICE 'Profile does not exist! ❌';
    END IF;
END $$;
