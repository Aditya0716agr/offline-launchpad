-- Add additional profile fields for user information
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS linkedin_url text,
ADD COLUMN IF NOT EXISTS github_url text,
ADD COLUMN IF NOT EXISTS twitter_url text,
ADD COLUMN IF NOT EXISTS designation text,
ADD COLUMN IF NOT EXISTS company text,
ADD COLUMN IF NOT EXISTS website_url text;