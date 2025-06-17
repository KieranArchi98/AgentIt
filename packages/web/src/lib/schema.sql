-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS forums;
DROP TABLE IF EXISTS profiles;

-- Create forums table
CREATE TABLE public.forums (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY,
    username TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create posts table
CREATE TABLE public.posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    forum_id TEXT REFERENCES public.forums(id) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    votes INTEGER DEFAULT 0
);

-- Create comments table
CREATE TABLE public.comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create votes table
CREATE TABLE public.votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    vote_type TEXT CHECK (vote_type IN ('up', 'down')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(user_id, post_id)
);

-- Create indexes for better performance
CREATE INDEX idx_posts_forum_id ON public.posts(forum_id);
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX idx_votes_post_id ON public.votes(post_id);
CREATE INDEX idx_votes_user_id ON public.votes(user_id);

-- Insert default forums
INSERT INTO public.forums (id, name, description) VALUES
    ('forum1', 'Technology', 'Discuss the latest in tech'),
    ('forum2', 'Gaming', 'Gaming news and discussions'),
    ('forum3', 'Science', 'Scientific discoveries and debates'),
    ('forum4', 'Movies', 'Film discussions and reviews');

-- Insert system user
INSERT INTO public.profiles (id, username, avatar_url)
VALUES ('00000000-0000-0000-0000-000000000001', 'System', NULL);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forums ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Forums policies (anyone can read, only admin can modify)
CREATE POLICY "Enable read access for all users" ON public.forums FOR SELECT USING (true);

-- Profiles policies
CREATE POLICY "Enable read access for all users" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Enable insert for users" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for users" ON public.profiles FOR UPDATE USING (true);

-- Posts policies
CREATE POLICY "Anyone can read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Anyone can create posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update posts" ON public.posts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete posts" ON public.posts FOR DELETE USING (true);

-- Comments policies
CREATE POLICY "Anyone can read comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Anyone can create comments" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update comments" ON public.comments FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete comments" ON public.comments FOR DELETE USING (true);

-- Votes policies
CREATE POLICY "Anyone can read votes" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Anyone can create votes" ON public.votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update votes" ON public.votes FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete votes" ON public.votes FOR DELETE USING (true);

-- Grant necessary privileges
GRANT ALL ON public.forums TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.posts TO anon, authenticated;
GRANT ALL ON public.comments TO anon, authenticated;
GRANT ALL ON public.votes TO anon, authenticated;

-- Create function to update post votes count
CREATE OR REPLACE FUNCTION update_post_votes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts
        SET votes = votes + (CASE WHEN NEW.vote_type = 'up' THEN 1 ELSE -1 END)
        WHERE id = NEW.post_id;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE posts
        SET votes = votes + (
            CASE 
                WHEN OLD.vote_type = NEW.vote_type THEN 0
                WHEN NEW.vote_type = 'up' THEN 2
                ELSE -2
            END
        )
        WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts
        SET votes = votes - (CASE WHEN OLD.vote_type = 'up' THEN 1 ELSE -1 END)
        WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for votes
CREATE TRIGGER votes_trigger
AFTER INSERT OR UPDATE OR DELETE ON votes
FOR EACH ROW EXECUTE FUNCTION update_post_votes(); 