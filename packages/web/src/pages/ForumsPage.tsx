import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Clock } from 'lucide-react';

interface Forum {
  id: number;
  name: string;
  description: string;
  created_at: string;
  post_count: number;
  last_activity: string | null;
}

export const ForumsPage = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await fetch('/api/v1/forums');
        if (!response.ok) throw new Error('Failed to fetch forums');
        const data = await response.json();
        setForums(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchForums();
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
      <h1 className="text-3xl font-bold mb-8">Forums</h1>
      <div className="grid gap-6">
        {forums.map((forum) => (
          <Link key={forum.id} to={`/forum/${forum.id}`}>
            <Card className="hover:bg-accent/50 transition-colors">
              <CardHeader>
                <CardTitle>{forum.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{forum.description}</p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>{forum.post_count} posts</span>
                  </div>
                  {forum.last_activity && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Last active {formatDistanceToNow(new Date(forum.last_activity))} ago</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}; 