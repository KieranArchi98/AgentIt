import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  forum_id: string;
  created_at: string;
  votes: number;
}

export function useRealtimePosts(forumId: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('posts')
          .select('*')
          .eq('forum_id', forumId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setPosts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();

    // Subscribe to changes
    const channel = supabase
      .channel(`public:posts`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts',
        filter: `forum_id=eq.${forumId}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setPosts(current => [payload.new as Post, ...current]);
        } else if (payload.eventType === 'DELETE') {
          setPosts(current => current.filter(post => post.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
          setPosts(current =>
            current.map(post =>
              post.id === payload.new.id ? payload.new as Post : post
            )
          );
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [forumId]);

  return { posts, isLoading, error };
}