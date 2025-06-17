import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { posthog } from '@/lib/posthog';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: {
    id: string;
    name: string;
  };
  parent_id: string | null;
  replies?: Comment[];
}

interface CommentListProps {
  postId: string;
}

export function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('comments')
          .select('*, author:users(id, name)')
          .eq('post_id', postId)
          .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;

        // Organize comments into a threaded structure
        const commentMap = new Map<string, Comment>();
        const rootComments: Comment[] = [];

        data.forEach((comment: Comment) => {
          commentMap.set(comment.id, { ...comment, replies: [] });
        });

        commentMap.forEach(comment => {
          if (comment.parent_id) {
            const parent = commentMap.get(comment.parent_id);
            if (parent) {
              parent.replies = parent.replies || [];
              parent.replies.push(comment);
            }
          } else {
            rootComments.push(comment);
          }
        });

        setComments(rootComments);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch comments';
        setError(errorMessage);
        posthog.capture('comments_fetch_error', { error: errorMessage });
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();

    // Subscribe to new comments
    const channel = supabase
      .channel(`post-${postId}-comments`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`
        },
        () => {
          fetchComments();
          posthog.capture('realtime_comment_received', { post_id: postId });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [postId]);

  const renderComment = (comment: Comment, depth = 0) => {
    const maxDepth = 5;
    const indentClass = depth > 0 ? `ml-${Math.min(depth * 4, maxDepth * 4)}` : '';

    return (
      <div key={comment.id} className={`py-4 ${indentClass}`}>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>{comment.author.name}</span>
          <span>•</span>
          <time dateTime={comment.created_at}>
            {new Date(comment.created_at).toLocaleDateString()}
          </time>
        </div>
        <div className="mt-2 text-sm">{comment.content}</div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Button disabled variant="ghost" size="sm">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading comments...
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map(comment => renderComment(comment))}
    </div>
  );
} 