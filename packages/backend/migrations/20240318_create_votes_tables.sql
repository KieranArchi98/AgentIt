-- Create post_votes table
CREATE TABLE IF NOT EXISTS post_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    vote_type TEXT CHECK (vote_type IN ('up', 'down', NULL)),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Create comment_votes table
CREATE TABLE IF NOT EXISTS comment_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    vote_type TEXT CHECK (vote_type IN ('up', 'down', NULL)),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

-- Create function to calculate post votes
CREATE OR REPLACE FUNCTION calculate_post_votes(post_id_param UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COALESCE(
            SUM(CASE 
                WHEN vote_type = 'up' THEN 1
                WHEN vote_type = 'down' THEN -1
                ELSE 0
            END), 0)::INTEGER
        FROM post_votes
        WHERE post_id = post_id_param
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate comment votes
CREATE OR REPLACE FUNCTION calculate_comment_votes(comment_id_param UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COALESCE(
            SUM(CASE 
                WHEN vote_type = 'up' THEN 1
                WHEN vote_type = 'down' THEN -1
                ELSE 0
            END), 0)::INTEGER
        FROM comment_votes
        WHERE comment_id = comment_id_param
    );
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update post votes count
CREATE OR REPLACE FUNCTION update_post_votes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts
    SET votes = calculate_post_votes(NEW.post_id)
    WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_votes_trigger
AFTER INSERT OR UPDATE OR DELETE ON post_votes
FOR EACH ROW EXECUTE FUNCTION update_post_votes();

-- Create trigger to update comment votes count
CREATE OR REPLACE FUNCTION update_comment_votes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE comments
    SET votes = calculate_comment_votes(NEW.comment_id)
    WHERE id = NEW.comment_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_votes_trigger
AFTER INSERT OR UPDATE OR DELETE ON comment_votes
FOR EACH ROW EXECUTE FUNCTION update_comment_votes();

-- Add votes column to posts table if it doesn't exist
ALTER TABLE posts ADD COLUMN IF NOT EXISTS votes INTEGER DEFAULT 0;

-- Add votes column to comments table if it doesn't exist
ALTER TABLE comments ADD COLUMN IF NOT EXISTS votes INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_post_votes_post_id ON post_votes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_votes_user_id ON post_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_votes_comment_id ON comment_votes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_votes_user_id ON comment_votes(user_id); 