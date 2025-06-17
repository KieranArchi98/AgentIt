import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  forum_id: string;
  user: {
    username: string;
  };
  votes: number;
}

interface ForumPostsProps {
  forumId?: string;
  limit?: number;
}

export function ForumPosts({ forumId, limit = 5 }: ForumPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        let query = supabase
          .from('posts')
          .select(`
            *,
            user:user_id (
              username
            )
          `)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (forumId) {
          query = query.eq('forum_id', forumId);
        }

        const { data, error: supabaseError } = await query;

        if (supabaseError) {
          throw supabaseError;
        }

        setPosts(data || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [forumId, limit]);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: limit }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[250px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-[300px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded-md bg-red-50">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        No posts found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <CardTitle className="text-lg">{post.title}</CardTitle>
            <div className="text-sm text-muted-foreground">
              Posted by {post.user?.username || 'Anonymous'} • {formatDistanceToNow(new Date(post.created_at))} ago • {post.votes} votes
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm line-clamp-2">{post.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 