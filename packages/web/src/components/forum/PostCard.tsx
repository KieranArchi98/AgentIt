import { useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  votes: number;
  author?: {
    username: string;
    avatar_url: string | null;
  };
}

export interface PostCardProps {
  post: Post;
  onVote?: () => void;
  onDelete?: () => void;
}

export function PostCard({ post, onVote, onDelete }: PostCardProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const { getToken } = useAuth();

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user) return;
    setIsVoting(true);
    setError(null);

    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:8000/api/posts/${post.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ vote_type: voteType })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to vote');
      }

      onVote?.();
    } catch (err) {
      console.error('Error voting:', err);
      setError(err instanceof Error ? err.message : 'Failed to vote');
    } finally {
      setIsVoting(false);
    }
  };

  const handleDelete = async () => {
    if (!user || user.id !== post.user_id) return;
    setIsDeleting(true);
    setError(null);

    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:8000/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete post');
      }

      onDelete?.();
    } catch (err) {
      console.error('Error deleting post:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <div className="text-sm text-gray-500">
          Posted by {post.author?.username || 'Anonymous'} •{' '}
          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{post.content}</p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleVote('up')}
            disabled={isVoting || !user}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            Up
          </Button>
          <span className="text-sm font-medium">{post.votes}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleVote('down')}
            disabled={isVoting || !user}
          >
            <ThumbsDown className="h-4 w-4 mr-1" />
            Down
          </Button>
        </div>
        {user && user.id === post.user_id && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 