import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/utils/apiClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@clerk/clerk-react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: {
    username: string;
  };
}

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  forum_id: string;
  profiles?: {
    username: string;
  };
  comments?: Comment[];
}

export const PostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            profiles!posts_user_id_fkey (username),
            comments (
              id,
              content,
              created_at,
              user_id,
              profiles!comments_user_id_fkey (username)
            )
          `)
          .eq('id', postId)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !postId || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: newComment.trim(),
          post_id: postId,
          user_id: user.id
        });

      if (error) throw error;

      // Refresh post data to get the new comment
      const { data: updatedPost } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey (username),
          comments (
            id,
            content,
            created_at,
            user_id,
            profiles!comments_user_id_fkey (username)
          )
        `)
        .eq('id', postId)
        .single();

      setPost(updatedPost);
      setNewComment('');
    } catch (err) {
      console.error('Error submitting comment:', err);
      setError('Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error || 'Post not found'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-4">
          Posted by {post.profiles?.username || 'Anonymous'} •{' '}
          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
        </div>
        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Comments</h2>
        
        {user ? (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="mb-2"
            />
            <Button type="submit" disabled={submitting || !newComment.trim()}>
              {submitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        ) : (
          <div className="text-sm text-gray-500 mb-6">
            Please sign in to leave a comment.
          </div>
        )}

        <div className="space-y-4">
          {post.comments?.length === 0 ? (
            <div className="text-gray-500">No comments yet</div>
          ) : (
            post.comments?.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start">
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">
                      {comment.profiles?.username || 'Anonymous'}
                    </span>
                    <span className="text-gray-500 ml-2">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}; 