-- Complete database setup for offline-launchpad
-- Run this in your new Supabase project's SQL Editor

-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create user roles enum
CREATE TYPE user_role AS ENUM ('founder', 'user', 'admin');

-- Create startup status enum
CREATE TYPE startup_status AS ENUM ('pending', 'approved', 'rejected');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'user',
    location TEXT,
    bio TEXT,
    designation TEXT,
    company TEXT,
    website_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    twitter_url TEXT,
    is_founding_member BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create startups table
CREATE TABLE public.startups (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    founder_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    logo_url TEXT,
    category_id UUID REFERENCES public.categories(id),
    location TEXT,
    city TEXT,
    state_region TEXT,
    full_address TEXT,
    website_url TEXT,
    whatsapp_link TEXT,
    email_contact TEXT,
    phone_number TEXT,
    status startup_status NOT NULL DEFAULT 'pending',
    tagline TEXT,
    stage TEXT,
    team_size TEXT,
    launch_date DATE,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    view_count INTEGER NOT NULL DEFAULT 0,
    cover_image_url TEXT,
    gallery_images TEXT[],
    looking_for TEXT[],
    social_facebook TEXT,
    social_instagram TEXT,
    social_linkedin TEXT,
    social_twitter TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create votes table
CREATE TABLE public.votes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, startup_id)
);

-- Create comments table
CREATE TABLE public.comments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookmarks table
CREATE TABLE public.bookmarks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, startup_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
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

-- RLS Policies for categories
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage categories" 
ON public.categories FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- RLS Policies for startups
CREATE POLICY "Approved startups are viewable by everyone" 
ON public.startups FOR SELECT 
USING (status = 'approved' OR founder_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Founders can insert their own startups" 
ON public.startups FOR INSERT 
WITH CHECK (founder_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Founders can update their own startups" 
ON public.startups FOR UPDATE 
USING (founder_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Founders and admins can delete startups" 
ON public.startups FOR DELETE 
USING (founder_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- RLS Policies for votes
CREATE POLICY "Votes are viewable by everyone" 
ON public.votes FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can vote" 
ON public.votes FOR INSERT 
WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own votes" 
ON public.votes FOR DELETE 
USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- RLS Policies for comments
CREATE POLICY "Comments are viewable by everyone" 
ON public.comments FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can comment" 
ON public.comments FOR INSERT 
WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own comments" 
ON public.comments FOR UPDATE 
USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own comments" 
ON public.comments FOR DELETE 
USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- RLS Policies for bookmarks
CREATE POLICY "Users can view their own bookmarks" 
ON public.bookmarks FOR SELECT 
USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Authenticated users can bookmark" 
ON public.bookmarks FOR INSERT 
WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own bookmarks" 
ON public.bookmarks FOR DELETE 
USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_startups_updated_at
  BEFORE UPDATE ON public.startups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' IN ('founder', 'user', 'admin') 
      THEN NEW.raw_user_meta_data->>'role'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default categories
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
  ('Other', 'other', 'Startups that don''t fit into other categories');

-- Function to generate slug from name
CREATE OR REPLACE FUNCTION public.generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(trim(input_text), '[^a-zA-Z0-9\s]', '', 'g'))
    || '-' || substr(md5(random()::text), 1, 8);
END;
$$ LANGUAGE plpgsql;

-- Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_view_count(startup_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.startups 
  SET view_count = view_count + 1 
  WHERE id = startup_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to get startup public view
CREATE OR REPLACE FUNCTION public.get_startup_public_view()
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  description TEXT,
  logo_url TEXT,
  category_id UUID,
  location TEXT,
  website_url TEXT,
  whatsapp_link TEXT,
  status TEXT,
  tagline TEXT,
  stage TEXT,
  team_size TEXT,
  launch_date DATE,
  is_featured BOOLEAN,
  view_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  city TEXT,
  state_region TEXT,
  full_address TEXT,
  email_contact TEXT,
  phone_number TEXT,
  cover_image_url TEXT,
  gallery_images TEXT[],
  looking_for TEXT[],
  social_facebook TEXT,
  social_instagram TEXT,
  social_linkedin TEXT,
  social_twitter TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.slug,
    s.description,
    s.logo_url,
    s.category_id,
    s.location,
    s.website_url,
    s.whatsapp_link,
    s.status::TEXT,
    s.tagline,
    s.stage,
    s.team_size,
    s.launch_date,
    s.is_featured,
    s.view_count,
    s.created_at,
    s.updated_at,
    s.city,
    s.state_region,
    s.full_address,
    s.email_contact,
    s.phone_number,
    s.cover_image_url,
    s.gallery_images,
    s.looking_for,
    s.social_facebook,
    s.social_instagram,
    s.social_linkedin,
    s.social_twitter
  FROM public.startups s
  WHERE s.status = 'approved';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create indexes for performance
CREATE INDEX idx_startups_status ON public.startups(status);
CREATE INDEX idx_startups_category_id ON public.startups(category_id);
CREATE INDEX idx_startups_launch_date ON public.startups(launch_date);
CREATE INDEX idx_startups_view_count ON public.startups(view_count DESC);
CREATE INDEX idx_startups_is_featured ON public.startups(is_featured);
CREATE INDEX idx_votes_startup_id ON public.votes(startup_id);
CREATE INDEX idx_comments_startup_id ON public.comments(startup_id);
CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);

-- Success message
SELECT 'Database setup completed successfully! 🎉' as message;
