import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getForums } from '@/utils/apiClient';
import { Wind, Flame, Waves, Mountain } from 'lucide-react';

interface Forum {
  id: string;
  name: string;
  description?: string;
  post_count?: number;
}

const elementalStyles = {
  air: 'text-sky-500',
  fire: 'text-red-500',
  water: 'text-blue-500',
  earth: 'text-emerald-500'
};

const getElementalIcon = (forumName: string) => {
  const name = forumName.toLowerCase();
  if (name.includes('air')) return Wind;
  if (name.includes('fire')) return Flame;
  if (name.includes('water')) return Waves;
  if (name.includes('earth')) return Mountain;
  return null;
};

const getElementalStyle = (forumName: string) => {
  const name = forumName.toLowerCase();
  if (name.includes('air')) return elementalStyles.air;
  if (name.includes('fire')) return elementalStyles.fire;
  if (name.includes('water')) return elementalStyles.water;
  if (name.includes('earth')) return elementalStyles.earth;
  return '';
};

export const ForumListPage = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const forumsData = await getForums();
        setForums(forumsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching forums:', err);
        setError('Failed to load forums');
      } finally {
        setLoading(false);
      }
    };

    fetchForums();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading forums...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Forums</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Forum
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posts
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {forums.map((forum) => {
              const ElementalIcon = getElementalIcon(forum.name);
              const elementalStyle = getElementalStyle(forum.name);
              return (
                <tr key={forum.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link
                      to={`/forum/${forum.id}`}
                      className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {ElementalIcon && (
                        <ElementalIcon className={`mr-2 h-4 w-4 ${elementalStyle}`} />
                      )}
                      {forum.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {forum.description || 'No description available'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {forum.post_count || 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 