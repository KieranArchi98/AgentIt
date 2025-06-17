import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { createPost } from '@/utils/apiClient';

interface CreatePostFormProps {
  forumId: string;
  userId: string;
}

export const CreatePostForm = ({ forumId, userId }: CreatePostFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      const post = await createPost(forumId, title, content, userId);
      toast({
        title: "Success",
        description: "Post created successfully"
      });
      navigate(`/forum/${forumId}/post/${post.id}`);
    } catch (err) {
      console.error('Error creating post:', err);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          required
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content..."
          required
          className="mt-1"
          rows={6}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          className="mr-2"
          onClick={() => navigate(`/forum/${forumId}`)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting || !title.trim() || !content.trim()}
        >
          {submitting ? 'Creating...' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
}; 