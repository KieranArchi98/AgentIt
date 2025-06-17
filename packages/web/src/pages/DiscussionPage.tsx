import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageSquare, Share2, Flag, MoreHorizontal } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

interface Reply {
  id: number;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
}

export const DiscussionPage = () => {
  const { id } = useParams();

  const discussion = {
    title: 'How to optimize database performance?',
    author: {
      name: 'DatabasePro',
      avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=DatabasePro',
      role: 'Senior Member',
    },
    content: `I've been working on optimizing our database performance and wanted to share some tips and get feedback from the community.

Here are some things I've tried:
1. Indexing frequently queried columns
2. Optimizing query patterns
3. Implementing caching strategies
4. Regular maintenance and cleanup

What other strategies have you found effective? Any specific tools or approaches you'd recommend?`,
    date: '2 days ago',
    views: 1234,
    likes: 45,
    isLiked: false,
  };

  const replies: Reply[] = [
    {
      id: 1,
      author: {
        name: 'OptimizationGuru',
        avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=OptimizationGuru',
        role: 'Expert',
      },
      content: 'Great tips! I would also suggest looking into query execution plans and optimizing based on those insights. Have you tried using any monitoring tools?',
      date: '1 day ago',
      likes: 12,
      isLiked: false,
    },
    {
      id: 2,
      author: {
        name: 'TechArchitect',
        avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=TechArchitect',
        role: 'Moderator',
      },
      content: 'Connection pooling is another important aspect to consider. It can significantly improve performance by reducing the overhead of creating new database connections.',
      date: '1 day ago',
      likes: 8,
      isLiked: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Discussion Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">{discussion.title}</h1>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span>Started by</span>
            <div className="flex items-center mx-2">
              <Avatar className="h-5 w-5 mr-2" src={discussion.author.avatar} />
              <span className="font-medium text-gray-900">{discussion.author.name}</span>
            </div>
            <span className="mx-1">•</span>
            <span>{discussion.date}</span>
            <span className="mx-1">•</span>
            <span>{discussion.views} views</span>
          </div>
        </div>

        {/* Main Post */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <Avatar className="h-10 w-10" src={discussion.author.avatar} />
              <div className="mt-1 text-center">
                <div className="text-sm font-medium text-gray-900">{discussion.author.name}</div>
                <div className="text-xs text-gray-500">{discussion.author.role}</div>
              </div>
            </div>
            <div className="flex-1">
              <div className="prose max-w-none">
                {discussion.content}
              </div>
              <div className="mt-6 flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  {discussion.likes}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Reply
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="ghost" size="sm">
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Replies */}
        <div className="divide-y divide-gray-200">
          {replies.map((reply) => (
            <div key={reply.id} className="p-6">
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <Avatar className="h-10 w-10" src={reply.author.avatar} />
                  <div className="mt-1 text-center">
                    <div className="text-sm font-medium text-gray-900">{reply.author.name}</div>
                    <div className="text-xs text-gray-500">{reply.author.role}</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="prose max-w-none">
                    {reply.content}
                  </div>
                  <div className="mt-4 flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className={`h-4 w-4 mr-2 ${reply.isLiked ? 'text-blue-500' : ''}`} />
                      {reply.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reply Box */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Post a Reply</h3>
        <textarea
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Write your reply..."
        />
        <div className="mt-4 flex justify-end">
          <Button>Post Reply</Button>
        </div>
      </div>
    </div>
  );
}; 