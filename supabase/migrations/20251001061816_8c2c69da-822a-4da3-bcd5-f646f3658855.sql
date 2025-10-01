-- Add founding_member field to profiles table
ALTER TABLE public.profiles
ADD COLUMN is_founding_member BOOLEAN NOT NULL DEFAULT false;

-- Add index for faster queries
CREATE INDEX idx_profiles_founding_member ON public.profiles(is_founding_member);