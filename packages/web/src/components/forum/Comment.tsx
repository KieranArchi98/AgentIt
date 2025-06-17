import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabase';
import { posthog } from '@/lib/posthog';
import { cn } from '@/lib/utils';
import { ThumbsUp, ThumbsDown, Reply } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { CreateCommentForm } from './CreateCommentForm';

interface CommentAuthor {
  id: string;
  name: string;
}

export interface CommentData {
  id: string;
  content: string;
  author: CommentAuthor;
  created_at: string;
  parent_id: string | null;
  votes: number;
  user_vote?: 'up' | 'down' | null;
  replies?: CommentData[];
}

interface CommentProps {
  comment: CommentData;
  postId: string;
  depth?: number;
  onReplySuccess?: () => void;
  className?: string;
}

const replySchema = z.object({
  content: z.string()
    .min(1, 'Reply cannot be empty')
    .max(1000, 'Reply must be less than 1000 characters')
});

type ReplyFormData = z.infer<typeof replySchema>;

export function Comment({ comment, postId, depth = 0, onReplySuccess, className = '' }: CommentProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { isSignedIn, user } = useUser();
  const maxDepth = 5; // Maximum nesting level

  const [votes, setVotes] = useState(comment.votes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(comment.user_vote || null);
  const [isVoting, setIsVoting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema)
  });

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!isSignedIn || !user || isVoting) return;

    setIsVoting(true);
    try {
      const { error } = await supabase
        .from('comment_votes')
        .upsert({
          comment_id: comment.id,
          user_id: user.id,
          vote_type: voteType
        });

      if (error) throw error;

      // Track vote in PostHog
      posthog.capture('comment_vote', {
        comment_id: comment.id,
        post_id: postId,
        vote_type: voteType
      });

      // Update local state
      const voteChange = 
        voteType === 'up' ? 1 : 
        voteType === 'down' ? -1 : 
        userVote === 'up' ? -1 : 
        userVote === 'down' ? 1 : 0;

      setVotes(prev => prev + voteChange);
      setUserVote(voteType);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const onSubmit = async (data: ReplyFormData) => {
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: data.content,
          post_id: postId,
          parent_id: comment.id,
          author: {
            id: user?.id,
            name: user?.firstName || 'Anonymous'
          }
        });

      if (error) throw error;

      // Track comment creation
      posthog.capture('comment_created', {
        post_id: postId,
        is_reply: true,
        depth: depth + 1
      });

      reset();
      setShowReplyForm(false);
      onReplySuccess?.();
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  };

  const formattedDate = new Date(comment.created_at).toLocaleDateString();

  return (
    <div className={cn("space-y-4", className)}>
      <Card className="relative overflow-hidden">
        <CardHeader className="space-y-2 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{comment.author.name}</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                {formattedDate}
              </span>
            </div>
            <Badge variant="secondary">
              {votes} votes
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-card-foreground whitespace-pre-wrap">
            {comment.content}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t bg-muted/50 px-6 py-3">
          <div className="flex items-center space-x-4">
            {isSignedIn && (
              <TooltipProvider>
                <div className="flex items-center space-x-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote('up')}
                        disabled={isVoting}
                        className={cn(
                          "h-8 w-8 p-0",
                          userVote === 'up' && "text-primary"
                        )}
                      >
                        <ThumbsUp size={16} />
                        <span className="sr-only">Upvote</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Upvote</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote('down')}
                        disabled={isVoting}
                        className={cn(
                          "h-8 w-8 p-0",
                          userVote === 'down' && "text-primary"
                        )}
                      >
                        <ThumbsDown size={16} />
                        <span className="sr-only">Downvote</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Downvote</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            )}
            {isSignedIn && depth < maxDepth && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="flex items-center space-x-2"
                >
                  <Reply size={16} />
                  <span>Reply</span>
                </Button>
              </>
            )}
          </div>
        </CardFooter>
      </Card>

      {showReplyForm && (
        <div className={cn("pl-4 lg:pl-8", depth > 0 && "border-l")}>
          <CreateCommentForm
            postId={comment.id}
            onSuccess={() => {
              setShowReplyForm(false);
              onReplySuccess?.();
            }}
          />
        </div>
      )}

      {/* Render replies recursively */}
      {comment.replies?.map((reply) => (
        <Comment
          key={reply.id}
          comment={reply}
          postId={postId}
          depth={depth + 1}
          onReplySuccess={onReplySuccess}
        />
      ))}
    </div>
  );
} 