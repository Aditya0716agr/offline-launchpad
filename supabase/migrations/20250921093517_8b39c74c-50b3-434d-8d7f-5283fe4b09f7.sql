-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create user roles enum
CREATE TYPE user_role AS ENUM ('founder', 'user', 'admin');

-- Create startup categories enum  
CREATE TYPE startup_category AS ENUM ('food', 'wellness', 'retail', 'services', 'beauty', 'fitness', 'education', 'consulting', 'other');

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
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create startups table
CREATE TABLE public.startups (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    founder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    logo_url TEXT,
    category startup_category NOT NULL,
    location TEXT,
    website_url TEXT,
    whatsapp_link TEXT,
    status startup_status NOT NULL DEFAULT 'pending',
    launch_date DATE,
    featured BOOLEAN NOT NULL DEFAULT false,
    view_count INTEGER NOT NULL DEFAULT 0,
    upvote_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create votes table
CREATE TABLE public.votes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, startup_id)
);

-- Create comments table
CREATE TABLE public.comments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Startups policies
CREATE POLICY "Everyone can view approved startups" 
ON public.startups FOR SELECT USING (status = 'approved' OR founder_id = auth.uid());

CREATE POLICY "Founders can insert their own startups" 
ON public.startups FOR INSERT WITH CHECK (auth.uid() = founder_id);

CREATE POLICY "Founders can update their own startups" 
ON public.startups FOR UPDATE USING (auth.uid() = founder_id);

CREATE POLICY "Admins can update all startups" 
ON public.startups FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Votes policies
CREATE POLICY "Users can view all votes" 
ON public.votes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert votes" 
ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" 
ON public.votes FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Everyone can view comments" 
ON public.comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments" 
ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_startups_status ON public.startups(status);
CREATE INDEX idx_startups_category ON public.startups(category);
CREATE INDEX idx_startups_launch_date ON public.startups(launch_date);
CREATE INDEX idx_startups_upvote_count ON public.startups(upvote_count DESC);
CREATE INDEX idx_votes_startup_id ON public.votes(startup_id);
CREATE INDEX idx_comments_startup_id ON public.comments(startup_id);

-- Create function to generate slug from startup name
CREATE OR REPLACE FUNCTION generate_startup_slug(startup_name TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(regexp_replace(regexp_replace(startup_name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_startups_updated_at
    BEFORE UPDATE ON public.startups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to update vote count when votes are added/removed
CREATE OR REPLACE FUNCTION update_startup_vote_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.startups 
        SET upvote_count = upvote_count + 1 
        WHERE id = NEW.startup_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.startups 
        SET upvote_count = upvote_count - 1 
        WHERE id = OLD.startup_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for vote count
CREATE TRIGGER update_vote_count_on_insert
    AFTER INSERT ON public.votes
    FOR EACH ROW
    EXECUTE FUNCTION update_startup_vote_count();

CREATE TRIGGER update_vote_count_on_delete
    AFTER DELETE ON public.votes
    FOR EACH ROW
    EXECUTE FUNCTION update_startup_vote_count();

-- Create function to auto-generate slug on startup insert
CREATE OR REPLACE FUNCTION set_startup_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug = generate_startup_slug(NEW.name);
        
        -- Ensure uniqueness
        WHILE EXISTS (SELECT 1 FROM public.startups WHERE slug = NEW.slug AND id != COALESCE(NEW.id, gen_random_uuid())) LOOP
            NEW.slug = NEW.slug || '-' || floor(random() * 1000)::text;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for slug generation
CREATE TRIGGER set_startup_slug_trigger
    BEFORE INSERT OR UPDATE ON public.startups
    FOR EACH ROW
    EXECUTE FUNCTION set_startup_slug();