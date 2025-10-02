-- Force profile creation for the current user
-- Run this in your Supabase SQL Editor

-- Step 1: Get the most recent user (likely you)
SELECT 'Creating profile for most recent user...' as info;

-- Step 2: Create profile for the most recent user
INSERT INTO public.profiles (user_id, full_name, role, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    'user',
    NOW(),
    NOW()
FROM auth.users au
WHERE au.id = (
    SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1
)
AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = au.id
)
ON CONFLICT (user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = NOW();

-- Step 3: Verify the profile was created
SELECT 'Profile creation result:' as info;
SELECT 
    p.id,
    p.user_id,
    p.full_name,
    p.role,
    p.created_at
FROM public.profiles p
WHERE p.user_id = (
    SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1
);

-- Step 4: Test the exact query the frontend uses
SELECT 'Testing frontend query for your user:' as info;
SELECT *
FROM public.profiles
WHERE user_id = (
    SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1
);

-- Success message
SELECT 'Profile creation completed! 🎉' as message;
SELECT 'Now refresh your dashboard - it should work!' as next_step;
