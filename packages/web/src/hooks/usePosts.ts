import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Post {
  id: string;
  title: string;
  content: string;
  forum_id: string;
  author: {
    name: string;
    id: string;
  };
  created_at: string;
  votes: number;
  comments_count: number;
}

interface UsePostsOptions {
  forumId?: string;
  limit?: number;
}

interface UsePostsReturn {
  posts: Post[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function usePosts({ forumId, limit = 10 }: UsePostsOptions = {}): UsePostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      // Add forum filter if forumId is provided
      if (forumId) {
        query = query.eq('forum_id', forumId);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;

      setPosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [forumId, limit]);

  return {
    posts,
    isLoading,
    error,
    refetch: fetchPosts
  };
} 