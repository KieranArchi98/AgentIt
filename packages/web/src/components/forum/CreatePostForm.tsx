import { useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface CreatePostFormProps {
  forumId: string;
  onSuccess?: () => void;
  className?: string;
  onCancel: () => void;
}

export function CreatePostForm({ forumId, onSuccess, className, onCancel }: CreatePostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create a post');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // First, create the post in Supabase
      const { data: supabasePost, error: supabaseError } = await supabase
        .from('posts')
        .insert([
          {
            title,
            content,
            forum_id: forumId,
            user_id: user.id,
            votes: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw supabaseError;
      }

      console.log('Created post in Supabase:', supabasePost);

      // Then, create the post in the backend
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          forum_id: forumId,
          user_id: user.id
        })
      });

      if (!response.ok) {
        // If backend fails, delete from Supabase to maintain consistency
        await supabase
          .from('posts')
          .delete()
          .eq('id', supabasePost.id);
          
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        throw new Error(errorData.detail || 'Failed to create post');
      }

      const backendPost = await response.json();
      console.log('Created post in backend:', backendPost);

      setTitle('');
      setContent('');
      onSuccess?.();
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={className}>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create a New Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 