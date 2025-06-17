import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { CreatePostForm } from '@/components/CreatePostForm';
import { supabase } from '@/utils/apiClient';

export const NewPostPage = () => {
  const { forumId } = useParams<{ forumId: string }>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!forumId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <CreatePostForm forumId={forumId} userId={user.id} />
      </div>
    </div>
  );
}; 