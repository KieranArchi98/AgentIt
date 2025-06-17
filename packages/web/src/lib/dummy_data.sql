-- Insert dummy data for forums
INSERT INTO public.forums (id, name, description, created_at)
VALUES 
  ('f1b6c3a2-d4e5-4f6g-7h8i-9j0k1l2m3n4', 'General Discussion', 'A place for general discussions about any topic', NOW()),
  ('a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5', 'Technical Support', 'Get help with technical issues and troubleshooting', NOW()),
  ('b2c3d4e5-f6g7-4h8i-9j0k-1l2m3n4o5p6', 'Feature Requests', 'Suggest and discuss new features', NOW()),
  ('c3d4e5f6-g7h8-4i9j-0k1l-2m3n4o5p6q7', 'Community Projects', 'Share and collaborate on community projects', NOW());

-- Insert dummy profiles (using UUID v4)
INSERT INTO public.profiles (id, username, avatar_url) VALUES
    ('11111111-1111-1111-1111-111111111111', 'techie', 'https://api.dicebear.com/7.x/avataaars/svg?seed=techie'),
    ('22222222-2222-2222-2222-222222222222', 'gamer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=gamer'),
    ('33333333-3333-3333-3333-333333333333', 'scientist', 'https://api.dicebear.com/7.x/avataaars/svg?seed=scientist'),
    ('44444444-4444-4444-4444-444444444444', 'moviebuff', 'https://api.dicebear.com/7.x/avataaars/svg?seed=moviebuff');

-- Insert dummy posts
INSERT INTO public.posts (id, title, content, user_id, forum_id, image_url, votes) VALUES
    ('a1111111-1111-1111-1111-111111111111', 'The Future of AI', 'Discussing the latest developments in artificial intelligence...', '11111111-1111-1111-1111-111111111111', 'tech', 'https://picsum.photos/800/400?random=1', 5),
    ('a2222222-2222-2222-2222-222222222222', 'React vs Vue in 2024', 'Comparing modern frontend frameworks...', '11111111-1111-1111-1111-111111111111', 'tech', 'https://picsum.photos/800/400?random=2', 3),
    ('b1111111-1111-1111-1111-111111111111', 'Starfield Review', 'My thoughts on Bethesda''s latest space RPG...', '22222222-2222-2222-2222-222222222222', 'gaming', 'https://picsum.photos/800/400?random=3', 7),
    ('b2222222-2222-2222-2222-222222222222', 'Best Games of 2024', 'A roundup of this year''s top games...', '22222222-2222-2222-2222-222222222222', 'gaming', 'https://picsum.photos/800/400?random=4', 4),
    ('c1111111-1111-1111-1111-111111111111', 'New Particle Discovery', 'Scientists at CERN have found...', '33333333-3333-3333-3333-333333333333', 'science', 'https://picsum.photos/800/400?random=5', 6),
    ('c2222222-2222-2222-2222-222222222222', 'Mars Mission Update', 'Latest news from the red planet...', '33333333-3333-3333-3333-333333333333', 'science', 'https://picsum.photos/800/400?random=6', 8),
    ('d1111111-1111-1111-1111-111111111111', 'Dune Part Two Review', 'An epic continuation of the saga...', '44444444-4444-4444-4444-444444444444', 'movies', 'https://picsum.photos/800/400?random=7', 10),
    ('d2222222-2222-2222-2222-222222222222', 'Oscar Predictions 2024', 'Who will win this year...', '44444444-4444-4444-4444-444444444444', 'movies', 'https://picsum.photos/800/400?random=8', 5);

-- Insert dummy comments
INSERT INTO public.comments (id, content, user_id, post_id, parent_id) VALUES
    ('cc111111-1111-1111-1111-111111111111', 'Great insights on AI!', '22222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', NULL),
    ('cc222222-2222-2222-2222-222222222222', 'I prefer Vue over React', '33333333-3333-3333-3333-333333333333', 'a2222222-2222-2222-2222-222222222222', NULL),
    ('cc333333-3333-3333-3333-333333333333', 'The game is amazing!', '11111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', NULL),
    ('cc444444-4444-4444-4444-444444444444', 'You missed some great games', '33333333-3333-3333-3333-333333333333', 'b2222222-2222-2222-2222-222222222222', NULL),
    ('cc555555-5555-5555-5555-555555555555', 'Fascinating discovery!', '44444444-4444-4444-4444-444444444444', 'c1111111-1111-1111-1111-111111111111', NULL),
    ('cc666666-6666-6666-6666-666666666666', 'When will humans land on Mars?', '11111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', NULL),
    ('cc777777-7777-7777-7777-777777777777', 'Best movie of the year!', '22222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', NULL),
    ('cc888888-8888-8888-8888-888888888888', 'I disagree with your predictions', '33333333-3333-3333-3333-333333333333', 'd2222222-2222-2222-2222-222222222222', NULL);

-- Insert dummy votes
INSERT INTO public.votes (id, user_id, post_id, vote_type) VALUES
    ('v1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'up'),
    ('v2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'up'),
    ('v3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'b1111111-1111-1111-1111-111111111111', 'up'),
    ('v4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'up'),
    ('v5555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'up');

-- Create some dummy users (if not exists)
INSERT INTO public.profiles (id, username, avatar_url)
VALUES
  ('u1a2b3c4-d5e6-4f7g-8h9i-0j1k2l3m4n5', 'TechGuru', 'https://api.dicebear.com/7.x/avatars/svg?seed=TechGuru'),
  ('u2b3c4d5-e6f7-4g8h-9i0j-1k2l3m4n5o6', 'CodeMaster', 'https://api.dicebear.com/7.x/avatars/svg?seed=CodeMaster'),
  ('u3c4d5e6-f7g8-4h9i-0j1k-2l3m4n5o6p7', 'DesignPro', 'https://api.dicebear.com/7.x/avatars/svg?seed=DesignPro'),
  ('u4d5e6f7-g8h9-4i0j-1k2l-3m4n5o6p7q8', 'DevNinja', 'https://api.dicebear.com/7.x/avatars/svg?seed=DevNinja')
ON CONFLICT (id) DO NOTHING;

-- General Discussion Posts
INSERT INTO public.posts (id, title, content, created_at, user_id, forum_id)
VALUES
  ('p1a2b3c4-d5e6-4f7g-8h9i-0j1k2l3m4n5', 'Welcome to the Community!', 'Hello everyone! This is a great place to start discussions about anything related to our community.', NOW() - INTERVAL '3 days', 'u1a2b3c4-d5e6-4f7g-8h9i-0j1k2l3m4n5', 'f1b6c3a2-d4e5-4f6g-7h8i-9j0k1l2m3n4'),
  ('p2b3c4d5-e6f7-4g8h-9i0j-1k2l3m4n5o6', 'Best Practices for Code Reviews', 'Let''s discuss what makes a good code review and how we can improve our process.', NOW() - INTERVAL '2 days', 'u2b3c4d5-e6f7-4g8h-9i0j-1k2l3m4n5o6', 'f1b6c3a2-d4e5-4f6g-7h8i-9j0k1l2m3n4'),
  ('p3c4d5e6-f7g8-4h9i-0j1k-2l3m4n5o6p7', 'Community Events Planning', 'Share your ideas for upcoming community events and meetups!', NOW() - INTERVAL '1 day', 'u3c4d5e6-f7g8-4h9i-0j1k-2l3m4n5o6p7', 'f1b6c3a2-d4e5-4f6g-7h8i-9j0k1l2m3n4'),
  ('p4d5e6f7-g8h9-4i0j-1k2l-3m4n5o6p7q8', 'Introducing Yourself', 'New to the community? Drop by and say hello!', NOW(), 'u4d5e6f7-g8h9-4i0j-1k2l-3m4n5o6p7q8', 'f1b6c3a2-d4e5-4f6g-7h8i-9j0k1l2m3n4');

-- Technical Support Posts
INSERT INTO public.posts (id, title, content, created_at, user_id, forum_id)
VALUES
  ('p5e6f7g8-h9i0-4j1k-2l3m-4n5o6p7q8r9', 'Common Debug Techniques', 'A guide to debugging common issues in development.', NOW() - INTERVAL '4 days', 'u1a2b3c4-d5e6-4f7g-8h9i-0j1k2l3m4n5', 'a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5'),
  ('p6f7g8h9-i0j1-4k2l-3m4n-5o6p7q8r9s0', 'Setup Guide for New Developers', 'Step-by-step guide to setting up your development environment.', NOW() - INTERVAL '3 days', 'u2b3c4d5-e6f7-4g8h-9i0j-1k2l3m4n5o6', 'a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5'),
  ('p7g8h9i0-j1k2-4l3m-4n5o-6p7q8r9s0t1', 'Troubleshooting Database Connections', 'Common database connection issues and their solutions.', NOW() - INTERVAL '2 days', 'u3c4d5e6-f7g8-4h9i-0j1k-2l3m4n5o6p7', 'a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5'),
  ('p8h9i0j1-k2l3-4m4n-5o6p-7q8r9s0t1u2', 'Performance Optimization Tips', 'Tips and tricks for optimizing your application performance.', NOW() - INTERVAL '1 day', 'u4d5e6f7-g8h9-4i0j-1k2l-3m4n5o6p7q8', 'a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5');

-- Feature Requests Posts
INSERT INTO public.posts (id, title, content, created_at, user_id, forum_id)
VALUES
  ('p9i0j1k2-l3m4-4n5o-6p7q-8r9s0t1u2v3', 'Dark Mode Support', 'Request for adding dark mode support to the platform.', NOW() - INTERVAL '5 days', 'u1a2b3c4-d5e6-4f7g-8h9i-0j1k2l3m4n5', 'b2c3d4e5-f6g7-4h8i-9j0k-1l2m3n4o5p6'),
  ('p0j1k2l3-m4n5-4o6p-7q8r-9s0t1u2v3w4', 'Mobile App Features', 'Suggestions for new mobile app features.', NOW() - INTERVAL '4 days', 'u2b3c4d5-e6f7-4g8h-9i0j-1k2l3m4n5o6', 'b2c3d4e5-f6g7-4h8i-9j0k-1l2m3n4o5p6'),
  ('pa2k2l3m-4n5o-4p6q-7r8s-9t0u1v2w3x4', 'API Integration Ideas', 'Ideas for new API integrations and improvements.', NOW() - INTERVAL '3 days', 'u3c4d5e6-f7g8-4h9i-0j1k-2l3m4n5o6p7', 'b2c3d4e5-f6g7-4h8i-9j0k-1l2m3n4o5p6'),
  ('pb3l3m4n-5o6p-4q7r-8s9t-0u1v2w3x4y5', 'Accessibility Improvements', 'Suggestions for improving platform accessibility.', NOW() - INTERVAL '2 days', 'u4d5e6f7-g8h9-4i0j-1k2l-3m4n5o6p7q8', 'b2c3d4e5-f6g7-4h8i-9j0k-1l2m3n4o5p6');

-- Community Projects Posts
INSERT INTO public.posts (id, title, content, created_at, user_id, forum_id)
VALUES
  ('pc4m4n5o-6p7q-4r8s-9t0u-1v2w3x4y5z6', 'Open Source Project Collaboration', 'Looking for contributors for an open source project.', NOW() - INTERVAL '6 days', 'u1a2b3c4-d5e6-4f7g-8h9i-0j1k2l3m4n5', 'c3d4e5f6-g7h8-4i9j-0k1l-2m3n4o5p6q7'),
  ('pd5n5o6p-7q8r-4s9t-0u1v-2w3x4y5z6a7', 'Community Hackathon Planning', 'Let''s organize a community hackathon!', NOW() - INTERVAL '5 days', 'u2b3c4d5-e6f7-4g8h-9i0j-1k2l3m4n5o6', 'c3d4e5f6-g7h8-4i9j-0k1l-2m3n4o5p6q7'),
  ('pe6o6p7q-8r9s-4t0u-1v2w-3x4y5z6a7b8', 'Documentation Project', 'Help improve our community documentation.', NOW() - INTERVAL '4 days', 'u3c4d5e6-f7g8-4h9i-0j1k-2l3m4n5o6p7', 'c3d4e5f6-g7h8-4i9j-0k1l-2m3n4o5p6q7'),
  ('pf7p7q8r-9s0t-4u1v-2w3x-4y5z6a7b8c9', 'UI/UX Enhancement Project', 'Project to improve the user interface and experience.', NOW() - INTERVAL '3 days', 'u4d5e6f7-g8h9-4i0j-1k2l-3m4n5o6p7q8', 'c3d4e5f6-g7h8-4i9j-0k1l-2m3n4o5p6q7');

-- Add some comments to posts
INSERT INTO public.comments (id, content, created_at, user_id, post_id)
SELECT 
  gen_random_uuid(),
  'Great post! Thanks for sharing.',
  created_at + INTERVAL '1 hour',
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  id
FROM public.posts;

-- Add some more varied comments
INSERT INTO public.comments (id, content, created_at, user_id, post_id)
SELECT 
  gen_random_uuid(),
  'I have a similar experience to share...',
  created_at + INTERVAL '2 hours',
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  id
FROM public.posts;

-- Create likes table if not exists
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  post_id UUID REFERENCES public.posts(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Add some initial likes
INSERT INTO public.likes (user_id, post_id)
SELECT 
  profiles.id,
  posts.id
FROM public.profiles
CROSS JOIN public.posts
WHERE random() < 0.3;  -- Add likes randomly to about 30% of post-user combinations

-- Create RLS policies
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to create likes"
ON public.likes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own likes"
ON public.likes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow everyone to view likes"
ON public.likes FOR SELECT
TO authenticated
USING (true);

-- Update post counts in forums
UPDATE public.forums
SET post_count = (
  SELECT COUNT(*)
  FROM public.posts
  WHERE posts.forum_id = forums.id
); 