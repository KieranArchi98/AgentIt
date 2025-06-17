import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { posthog } from '@/lib/posthog';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CreateCommentFormProps {
  postId: string;
  onSuccess?: () => void;
  className?: string;
}

export function CreateCommentForm({ postId, onSuccess, className }: CreateCommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: submitError } = await supabase
        .from('comments')
        .insert([{
          content,
          post_id: postId,
          user_id: user.id,
          author_email: user.primaryEmailAddress?.emailAddress
        }]);

      if (submitError) throw submitError;

      // Track comment creation
      posthog.capture('comment_created', {
        post_id: postId,
        is_reply: false
      });

      setContent('');
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to post comment';
      setError(errorMessage);
      posthog.capture('comment_creation_error', { error: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={cn("border-none shadow-none", className)}>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 p-0">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="comment">Your comment</Label>
            <Textarea
              id="comment"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your comment here..."
              className="min-h-[100px] resize-none"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 px-0 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setContent('')}
            disabled={isSubmitting || !content}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 