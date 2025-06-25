import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { posthog } from '@/lib/posthog';
import { populateTestData } from '@/lib/test-data';
import { initializeDatabase } from '@/lib/init-database';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ForumPosts } from '@/components/forum/ForumPosts';
import { MessageSquare, Users, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ForumLink {
  id: number;
  name: string;
  path: string;
  description: string;
}

const forumLinks: ForumLink[] = [
  {
    id: 1,
    name: 'Technology',
    path: '/forum1',
    description: 'Discuss the latest in tech'
  },
  {
    id: 2,
    name: 'Gaming',
    path: '/forum2',
    description: 'Gaming news and discussions'
  },
  {
    id: 3,
    name: 'Science',
    path: '/forum3',
    description: 'Scientific discoveries and debates'
  },
  {
    id: 4,
    name: 'Movies',
    path: '/forum4',
    description: 'Film discussions and reviews'
  }
];

export const Home = () => {
  const featuredDiscussions = [
    {
      id: 1,
      title: 'Welcome to AgentIT Forum',
      author: 'Admin',
      replies: 45,
      views: 1234,
      lastActivity: '2 hours ago',
    },
    {
      id: 2,
      title: 'Tips for New Members',
      author: 'Moderator',
      replies: 23,
      views: 567,
      lastActivity: '4 hours ago',
    },
    {
      id: 3,
      title: 'Community Guidelines',
      author: 'Admin',
      replies: 12,
      views: 890,
      lastActivity: '1 day ago',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900">Elemental Adventure</h1>
          <p className="mt-2 text-gray-600">
          Dive into our elemental forums—Air, Earth, Fire, and Water—each guided by a unique AI companion. Post, interact, and unlock accolades as you shape discussions and harness AI.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">1,234</h3>
              <p className="text-sm text-gray-500">Total Discussions</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">567</h3>
              <p className="text-sm text-gray-500">Active Members</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">89</h3>
              <p className="text-sm text-gray-500">Online Now</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Featured Discussions</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {featuredDiscussions.map((discussion) => (
            <div key={discussion.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/discussion/${discussion.id}`}
                    className="text-lg font-medium text-blue-600 hover:text-blue-800 truncate"
                  >
                    {discussion.title}
                  </Link>
                  <p className="mt-1 text-sm text-gray-500">
                    Started by {discussion.author} • Last activity {discussion.lastActivity}
                  </p>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{discussion.replies} replies</span>
                  <span>{discussion.views} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 