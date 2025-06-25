import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, ThumbsUp, User } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  author_id: string;
  author_name: string;
  forum_id: number;
  forum_name: string;
  vote_count: number;
  comment_count: number;
}

export const PopularPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const response = await fetch('/api/v1/posts/popular');
        if (!response.ok) throw new Error('Failed to fetch popular posts');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Popular Posts</h1>
      <div className="grid gap-6">
        {posts.map((post) => (
          <Link key={post.id} to={`/forum/${post.forum_id}/post/${post.id}`}>
            <Card className="hover:bg-accent/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Link 
                    to={`/forum/${post.forum_id}`}
                    className="text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {post.forum_name}
                  </Link>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.author_name}</span>
                  </div>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(post.created_at))} ago</span>
                </div>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{post.vote_count} votes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comment_count} comments</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}; 