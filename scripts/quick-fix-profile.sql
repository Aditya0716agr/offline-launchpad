-- Quick fix for profile creation - run this in Supabase SQL Editor

-- Temporarily disable RLS to allow profile creation
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Create a simple profile for the current user if they don't have one
-- (Replace 'your-email@example.com' with your actual email)
INSERT INTO public.profiles (user_id, full_name, role)
SELECT 
    au.id,
    au.email,
    'user'::user_role
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.user_id
WHERE p.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create proper RLS policies
DROP POLICY IF EXISTS "Everyone can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

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

-- Show how many profiles were created
SELECT 'Profiles created:' as message, COUNT(*) as count FROM public.profiles;

-- Success message
SELECT 'Profile creation fix completed! 🎉 Refresh your dashboard now.' as message;
