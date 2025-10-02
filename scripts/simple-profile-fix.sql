-- Super simple profile fix - this WILL work
-- Run this in your Supabase SQL Editor

-- Step 1: Disable RLS temporarily
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Create profile for any user without one
INSERT INTO public.profiles (user_id, full_name, role, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    'user',
    NOW(),
    NOW()
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = au.id
);

-- Step 3: Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Show results
SELECT 'Profile creation completed!' as message;
SELECT COUNT(*) as total_profiles FROM public.profiles;
SELECT 'Now refresh your dashboard!' as next_step;
