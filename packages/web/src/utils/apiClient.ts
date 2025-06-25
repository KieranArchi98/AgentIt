//Client side utility using supabase js sdk
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log environment variables status
console.log('Supabase Configuration:', {
  urlConfigured: !!supabaseUrl,
  anonKeyConfigured: !!supabaseAnonKey,
  url: supabaseUrl?.substring(0, 10) + '...' // Only log part of the URL for security
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log successful client creation
console.log('Supabase client created successfully');

// Helper function to log database operations
const logDbOperation = (operation: string, details: any) => {
  console.log(`[Supabase ${operation}]`, details);
};

interface Post {
  id: string;
  comments?: Array<{
    id: string;
    content: string;
    created_at: string;
  }>;
}

// Fetch forums
export const getForums = async () => {
  logDbOperation('Query', { table: 'forums', operation: 'SELECT' });
  try {
    const { data, error } = await supabase
      .from('forums')
      .select('*')
      .order('name');

    if (error) {
      console.error('[Supabase Error] Failed to fetch forums:', error);
      throw error;
    }

    logDbOperation('Result', { table: 'forums', count: data?.length });
    return data;
  } catch (error) {
    console.error('[API Error] Failed to fetch forums:', error);
    throw error;
  }
};

// Fetch posts for a specific forum
export const getForumPosts = async (forumId: string) => {
  logDbOperation('Query', { table: 'posts', operation: 'SELECT', forumId });
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles!posts_user_id_fkey (
          username,
          avatar_url
        ),
        comments (
          id,
          content,
          created_at,
          profiles!comments_user_id_fkey (
            username,
            avatar_url
          )
        )
      `)
      .eq('forum_id', forumId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase Error] Failed to fetch forum posts:', error);
      throw error;
    }

    logDbOperation('Result', { 
      table: 'posts', 
      forumId,
      postCount: data?.length,
      commentCount: data?.reduce((acc: number, post: Post) => acc + (post.comments?.length || 0), 0)
    });
    return data;
  } catch (error) {
    console.error('[API Error] Failed to fetch forum posts:', error);
    throw error;
  }
};

// Create a new post
export const createPost = async (forumId: string, title: string, content: string, userId: string) => {
  logDbOperation('Query', { table: 'posts', operation: 'INSERT', forumId });
  const { data, error } = await supabase
    .from('posts')
    .insert({
      forum_id: forumId,
      title,
      content,
      user_id: userId
    })
    .select()
    .single();

  if (error) {
    console.error('[Supabase Error] Failed to create post:', error);
    throw error;
  }

  logDbOperation('Result', { table: 'posts', operation: 'INSERT', postId: data?.id });
  return data;
};

// Delete a post
export const deletePost = async (postId: string, userId: string) => {
  logDbOperation('Query', { table: 'posts', operation: 'DELETE', postId });
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', userId);

  if (error) {
    console.error('[Supabase Error] Failed to delete post:', error);
    throw error;
  }

  logDbOperation('Result', { table: 'posts', operation: 'DELETE', postId });
};

// Create a comment
export const createComment = async (postId: string, content: string, userId: string) => {
  logDbOperation('Query', { table: 'comments', operation: 'INSERT', postId });
  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      content,
      user_id: userId
    })
    .select(`
      id,
      content,
      created_at,
      user_id,
      profiles:user_id (username, avatar_url)
    `)
    .single();

  if (error) {
    console.error('[Supabase Error] Failed to create comment:', error);
    throw error;
  }

  logDbOperation('Result', { table: 'comments', operation: 'INSERT', commentId: data?.id });
  return data;
};

// Delete a comment
export const deleteComment = async (commentId: string, userId: string) => {
  logDbOperation('Query', { table: 'comments', operation: 'DELETE', commentId });
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId);

  if (error) {
    console.error('[Supabase Error] Failed to delete comment:', error);
    throw error;
  }

  logDbOperation('Result', { table: 'comments', operation: 'DELETE', commentId });
};

// Toggle like on a post
export const toggleLike = async (postId: string, userId: string) => {
  logDbOperation('Query', { table: 'likes', operation: 'TOGGLE', postId });
  
  // Check if like exists
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) {
      console.error('[Supabase Error] Failed to unlike post:', error);
      throw error;
    }

    logDbOperation('Result', { table: 'likes', operation: 'DELETE', postId });
    return false;
  } else {
    // Like
    const { error } = await supabase
      .from('likes')
      .insert({
        post_id: postId,
        user_id: userId
      });

    if (error) {
      console.error('[Supabase Error] Failed to like post:', error);
      throw error;
    }

    logDbOperation('Result', { table: 'likes', operation: 'INSERT', postId });
    return true;
  }
};

export const subscribeToNewPosts = (callback: (payload: any) => void) => {
  logDbOperation('Subscription', { table: 'posts', event: 'INSERT' });
  return supabase
    .channel('public:posts')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'posts'
    }, (payload) => {
      logDbOperation('New Post', payload);
      callback(payload);
    })
    .subscribe();
} 