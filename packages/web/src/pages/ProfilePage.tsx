import { useParams } from 'react-router-dom';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, Calendar, Award, MapPin, Link as LinkIcon } from 'lucide-react';

export const ProfilePage = () => {
  const { username } = useParams();

  const userProfile = {
    name: username,
    avatar: `https://api.dicebear.com/7.x/avatars/svg?seed=${username}`,
    role: 'Senior Member',
    joinDate: 'January 2023',
    location: 'New York, USA',
    website: 'https://example.com',
    bio: 'Passionate about technology and software development. Always learning and sharing knowledge with the community.',
    stats: {
      posts: 1234,
      reputation: 4567,
      followers: 89,
      following: 45,
    },
    badges: [
      { name: 'Top Contributor', color: 'bg-yellow-100 text-yellow-800' },
      { name: 'Problem Solver', color: 'bg-green-100 text-green-800' },
      { name: 'Helpful Member', color: 'bg-blue-100 text-blue-800' },
    ],
    recentActivity: [
      {
        type: 'post',
        title: 'How to optimize database performance?',
        date: '2 days ago',
      },
      {
        type: 'reply',
        title: 'Re: Best practices for API security',
        date: '3 days ago',
      },
      {
        type: 'post',
        title: 'Understanding microservices architecture',
        date: '1 week ago',
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500" />
        <div className="px-6 py-4">
          <div className="flex items-start -mt-12">
            <Avatar src={userProfile.avatar} className="h-24 w-24 ring-4 ring-white" />
            <div className="ml-6 pt-12">
              <h1 className="text-2xl font-bold text-gray-900">{userProfile.name}</h1>
              <p className="text-sm text-gray-500">{userProfile.role}</p>
            </div>
            <div className="ml-auto pt-12">
              <Button variant="outline" className="mr-2">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Follow
              </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                Joined {userProfile.joinDate}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-2" />
                {userProfile.location}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <LinkIcon className="h-4 w-4 mr-2" />
                <a href={userProfile.website} className="text-blue-600 hover:text-blue-800">
                  {userProfile.website}
                </a>
              </div>
            </div>
            <div>
              <p className="text-gray-600">{userProfile.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats and Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{userProfile.stats.posts}</div>
              <div className="text-sm text-gray-500">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{userProfile.stats.reputation}</div>
              <div className="text-sm text-gray-500">Reputation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{userProfile.stats.followers}</div>
              <div className="text-sm text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{userProfile.stats.following}</div>
              <div className="text-sm text-gray-500">Following</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Badges</h2>
          <div className="flex flex-wrap gap-2">
            {userProfile.badges.map((badge) => (
              <span
                key={badge.name}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}
              >
                <Award className="h-4 w-4 mr-1" />
                {badge.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {userProfile.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0">
                {activity.type === 'post' ? (
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                ) : (
                  <MessageSquare className="h-5 w-5 text-green-500" />
                )}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 