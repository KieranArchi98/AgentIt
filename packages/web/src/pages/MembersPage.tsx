import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Member {
  id: number;
  name: string;
  avatar: string;
  role: string;
  joinDate: string;
  posts: number;
  reputation: number;
  lastSeen: string;
}

export const MembersPage = () => {
  const members: Member[] = [
    {
      id: 1,
      name: 'TechGuru',
      avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=TechGuru',
      role: 'Administrator',
      joinDate: 'Jan 2023',
      posts: 1234,
      reputation: 4567,
      lastSeen: '5 minutes ago',
    },
    {
      id: 2,
      name: 'CodeMaster',
      avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=CodeMaster',
      role: 'Moderator',
      joinDate: 'Mar 2023',
      posts: 890,
      reputation: 2345,
      lastSeen: '1 hour ago',
    },
    {
      id: 3,
      name: 'DesignPro',
      avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=DesignPro',
      role: 'Member',
      joinDate: 'Jun 2023',
      posts: 456,
      reputation: 1234,
      lastSeen: '2 hours ago',
    },
    {
      id: 4,
      name: 'SecurityExpert',
      avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=SecurityExpert',
      role: 'Member',
      joinDate: 'Aug 2023',
      posts: 234,
      reputation: 890,
      lastSeen: '1 day ago',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Members</h1>
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search members..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Join Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posts
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reputation
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Seen
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Avatar src={member.avatar} alt={member.name} className="h-8 w-8" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                        {member.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    member.role === 'Administrator' ? 'bg-red-100 text-red-800' :
                    member.role === 'Moderator' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.joinDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.posts}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.reputation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.lastSeen}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 