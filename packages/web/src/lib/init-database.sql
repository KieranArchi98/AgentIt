-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (be careful with this in production!)
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS forums;
DROP TABLE IF EXISTS profiles;

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forums table
CREATE TABLE forums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    post_count INTEGER DEFAULT 0
);

-- Create posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    forum_id UUID REFERENCES forums(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    comment_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0
);

-- Create comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE -- For reply functionality
);

-- Create likes table
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Create triggers to update post counts
CREATE OR REPLACE FUNCTION update_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE forums SET post_count = post_count + 1 WHERE id = NEW.forum_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE forums SET post_count = post_count - 1 WHERE id = OLD.forum_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_forum_post_count
AFTER INSERT OR DELETE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_post_count();

-- Create trigger to update comment counts
CREATE OR REPLACE FUNCTION update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_comment_count
AFTER INSERT OR DELETE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_comment_count();

-- Create trigger to update like counts
CREATE OR REPLACE FUNCTION update_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET like_count = like_count - 1 WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_like_count
AFTER INSERT OR DELETE ON likes
FOR EACH ROW
EXECUTE FUNCTION update_like_count();

-- Insert dummy data
-- Create the four elemental forums
INSERT INTO forums (id, name, description) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Water', 'Discussions about water bending, healing, and the Water Tribes'),
    ('22222222-2222-2222-2222-222222222222', 'Earth', 'Share your knowledge about earth bending, metal bending, and the Earth Kingdom'),
    ('33333333-3333-3333-3333-333333333333', 'Fire', 'Topics related to fire bending, lightning generation, and the Fire Nation'),
    ('44444444-4444-4444-4444-444444444444', 'Air', 'Explore air bending techniques, spiritual matters, and Air Nomad culture');

-- Create some users
INSERT INTO profiles (id, username, avatar_url) VALUES
    ('aaaa1111-aaaa-1111-aaaa-111111111111', 'Katara', 'https://api.dicebear.com/7.x/avatars/svg?seed=Katara'),
    ('bbbb2222-bbbb-2222-bbbb-222222222222', 'Toph', 'https://api.dicebear.com/7.x/avatars/svg?seed=Toph'),
    ('cccc3333-cccc-3333-cccc-333333333333', 'Zuko', 'https://api.dicebear.com/7.x/avatars/svg?seed=Zuko'),
    ('dddd4444-dddd-4444-dddd-444444444444', 'Aang', 'https://api.dicebear.com/7.x/avatars/svg?seed=Aang');

-- Water Tribe Posts
INSERT INTO posts (id, title, content, forum_id, user_id) VALUES
    ('aaaa1111-1111-1111-1111-aaaaaaaaaaaa', 'Advanced Healing Techniques', 'A comprehensive guide to advanced healing techniques using water bending...', '11111111-1111-1111-1111-111111111111', 'aaaa1111-aaaa-1111-aaaa-111111111111'),
    ('aaaa2222-2222-2222-2222-aaaaaaaaaaaa', 'Northern Water Tribe Architecture', 'Exploring the beautiful ice structures of the Northern Water Tribe...', '11111111-1111-1111-1111-111111111111', 'bbbb2222-bbbb-2222-bbbb-222222222222'),
    ('aaaa3333-3333-3333-3333-aaaaaaaaaaaa', 'Southern Water Tribe Traditions', 'Preserving our cultural heritage and traditions in the South...', '11111111-1111-1111-1111-111111111111', 'cccc3333-cccc-3333-cccc-333333333333');

-- Earth Kingdom Posts
INSERT INTO posts (id, title, content, forum_id, user_id) VALUES
    ('bbbb1111-1111-1111-1111-bbbbbbbbbbbb', 'Metal Bending 101', 'Basic techniques for detecting and manipulating refined earth in metal...', '22222222-2222-2222-2222-222222222222', 'bbbb2222-bbbb-2222-bbbb-222222222222'),
    ('bbbb2222-2222-2222-2222-bbbbbbbbbbbb', 'Ba Sing Se Daily Life', 'A day in the life within the great walls of Ba Sing Se...', '22222222-2222-2222-2222-222222222222', 'aaaa1111-aaaa-1111-aaaa-111111111111'),
    ('bbbb3333-3333-3333-3333-bbbbbbbbbbbb', 'Earth Rumble Tournament', 'Announcing the next Earth Rumble tournament! Sign up now...', '22222222-2222-2222-2222-222222222222', 'dddd4444-dddd-4444-dddd-444444444444');

-- Fire Nation Posts
INSERT INTO posts (id, title, content, forum_id, user_id) VALUES
    ('cccc1111-1111-1111-1111-cccccccccccc', 'Lightning Redirection', 'Understanding the principles of redirecting lightning safely...', '33333333-3333-3333-3333-333333333333', 'cccc3333-cccc-3333-cccc-333333333333'),
    ('cccc2222-2222-2222-2222-cccccccccccc', 'Dragon Dancing Techniques', 'Ancient fire bending forms learned from the original masters...', '33333333-3333-3333-3333-333333333333', 'dddd4444-dddd-4444-dddd-444444444444'),
    ('cccc3333-3333-3333-3333-cccccccccccc', 'Fire Nation Festival', 'Celebrating the Fire Nation cultural festival next month...', '33333333-3333-3333-3333-333333333333', 'aaaa1111-aaaa-1111-aaaa-111111111111');

-- Air Nomad Posts
INSERT INTO posts (id, title, content, forum_id, user_id) VALUES
    ('dddd1111-1111-1111-1111-dddddddddddd', 'Meditation and Spirituality', 'Connecting with the spirit world through ancient Air Nomad practices...', '44444444-4444-4444-4444-444444444444', 'dddd4444-dddd-4444-dddd-444444444444'),
    ('dddd2222-2222-2222-2222-dddddddddddd', 'Air Temple Restoration', 'Progress updates on the restoration of the Southern Air Temple...', '44444444-4444-4444-4444-444444444444', 'cccc3333-cccc-3333-cccc-333333333333'),
    ('dddd3333-3333-3333-3333-dddddddddddd', 'Sky Bison Care Guide', 'Essential tips for caring for your sky bison companion...', '44444444-4444-4444-4444-444444444444', 'bbbb2222-bbbb-2222-bbbb-222222222222');

-- Add comments to posts
INSERT INTO comments (id, content, post_id, user_id) VALUES
    -- Water Tribe post comments
    ('aaaa1111-cccc-1111-1111-ffffffffffff', 'These healing techniques have been so helpful in my practice!', 'aaaa1111-1111-1111-1111-aaaaaaaaaaaa', 'bbbb2222-bbbb-2222-bbbb-222222222222'),
    ('aaaa2222-cccc-2222-2222-ffffffffffff', 'Could you elaborate on the moon''s influence on healing?', 'aaaa1111-1111-1111-1111-aaaaaaaaaaaa', 'cccc3333-cccc-3333-cccc-333333333333'),
    
    -- Earth Kingdom post comments
    ('bbbb1111-cccc-1111-1111-ffffffffffff', 'Great introduction to metal bending! When''s the next class?', 'bbbb1111-1111-1111-1111-bbbbbbbbbbbb', 'aaaa1111-aaaa-1111-aaaa-111111111111'),
    ('bbbb2222-cccc-2222-2222-ffffffffffff', 'The key is to feel the earth within the metal...', 'bbbb1111-1111-1111-1111-bbbbbbbbbbbb', 'bbbb2222-bbbb-2222-bbbb-222222222222'),
    
    -- Fire Nation post comments
    ('cccc1111-cccc-1111-1111-ffffffffffff', 'This technique saved my life during training!', 'cccc1111-1111-1111-1111-cccccccccccc', 'dddd4444-dddd-4444-dddd-444444444444'),
    ('cccc2222-cccc-2222-2222-ffffffffffff', 'Remember to maintain your root while redirecting.', 'cccc1111-1111-1111-1111-cccccccccccc', 'cccc3333-cccc-3333-cccc-333333333333'),
    
    -- Air Nomad post comments
    ('dddd1111-cccc-1111-1111-ffffffffffff', 'The meditation techniques are life-changing!', 'dddd1111-1111-1111-1111-dddddddddddd', 'aaaa1111-aaaa-1111-aaaa-111111111111'),
    ('dddd2222-cccc-2222-2222-ffffffffffff', 'Looking forward to the next spiritual retreat.', 'dddd1111-1111-1111-1111-dddddddddddd', 'cccc3333-cccc-3333-cccc-333333333333');

-- Add some likes
INSERT INTO likes (post_id, user_id) VALUES
    -- Water Tribe post likes
    ('aaaa1111-1111-1111-1111-aaaaaaaaaaaa', 'bbbb2222-bbbb-2222-bbbb-222222222222'),
    ('aaaa1111-1111-1111-1111-aaaaaaaaaaaa', 'cccc3333-cccc-3333-cccc-333333333333'),
    ('aaaa2222-2222-2222-2222-aaaaaaaaaaaa', 'aaaa1111-aaaa-1111-aaaa-111111111111'),
    
    -- Earth Kingdom post likes
    ('bbbb1111-1111-1111-1111-bbbbbbbbbbbb', 'aaaa1111-aaaa-1111-aaaa-111111111111'),
    ('bbbb1111-1111-1111-1111-bbbbbbbbbbbb', 'dddd4444-dddd-4444-dddd-444444444444'),
    ('bbbb2222-2222-2222-2222-bbbbbbbbbbbb', 'cccc3333-cccc-3333-cccc-333333333333'),
    
    -- Fire Nation post likes
    ('cccc1111-1111-1111-1111-cccccccccccc', 'dddd4444-dddd-4444-dddd-444444444444'),
    ('cccc1111-1111-1111-1111-cccccccccccc', 'bbbb2222-bbbb-2222-bbbb-222222222222'),
    ('cccc2222-2222-2222-2222-cccccccccccc', 'aaaa1111-aaaa-1111-aaaa-111111111111'),
    
    -- Air Nomad post likes
    ('dddd1111-1111-1111-1111-dddddddddddd', 'cccc3333-cccc-3333-cccc-333333333333'),
    ('dddd1111-1111-1111-1111-dddddddddddd', 'bbbb2222-bbbb-2222-bbbb-222222222222'),
    ('dddd2222-2222-2222-2222-dddddddddddd', 'aaaa1111-aaaa-1111-aaaa-111111111111');

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Posts policies
CREATE POLICY "Posts are viewable by everyone"
ON posts FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can create posts"
ON posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
ON posts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone"
ON comments FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can create comments"
ON comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
ON comments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
ON comments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Likes are viewable by everyone"
ON likes FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can create likes"
ON likes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
ON likes FOR DELETE
TO authenticated
USING (auth.uid() = user_id); 