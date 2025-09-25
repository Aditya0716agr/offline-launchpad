-- Fix all functions to have proper search_path settings
-- Update existing functions that don't have search_path set

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql STABLE SET search_path = public;

-- Fix generate_slug function
CREATE OR REPLACE FUNCTION public.generate_slug(input_text text)
RETURNS text AS $$
BEGIN
  RETURN lower(regexp_replace(trim(input_text), '[^a-zA-Z0-9\s]', '', 'g'))
    || '-' || substr(md5(random()::text), 1, 8);
END;
$$ LANGUAGE plpgsql VOLATILE SET search_path = public;

-- The handle_new_user and increment_view_count functions already have search_path set correctly