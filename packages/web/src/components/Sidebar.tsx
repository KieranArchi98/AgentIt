import { Link } from 'react-router-dom';
import { Home, MessageSquare, Users, Clock, Star, Settings, Wind, Flame, Waves, Mountain } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getForums } from '@/utils/apiClient';
import { Button } from './ui/button';

interface Forum {
  id: string;
  name: string;
  post_count?: number;
  description?: string;
}

interface SidebarProps {
  className?: string;
  isSignedIn?: boolean;
  onCloseSidebar?: () => void;
}

// Add this CSS to your styles
const elementalStyles = {
  air: 'text-sky-500 animate-pulse',
  fire: 'text-red-500 animate-pulse',
  water: 'text-blue-500 animate-pulse',
  earth: 'text-emerald-500 animate-pulse'
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

export const Sidebar = ({ className = '', isSignedIn, onCloseSidebar }: SidebarProps) => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const forumsData = await getForums();
        console.log('Fetched forums:', forumsData);
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

  const quickLinks = [
    { icon: Home, label: 'Home', to: '/' },
    { icon: MessageSquare, label: 'Latest Posts', to: '/latest' },
    { icon: Users, label: 'Active Users', to: '/active-users' },
    { icon: Clock, label: 'Recent Activity', to: '/recent' },
    { icon: Star, label: 'Popular Topics', to: '/popular' },
    { icon: Settings, label: 'Settings', to: '/settings' },
  ];

  const handleLinkClick = () => {
    if (onCloseSidebar) {
      onCloseSidebar();
    }
  };

  return (
    <aside className={`bg-white p-4 rounded-lg shadow ${className}`}>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Quick Links
          </h3>
          <nav className="space-y-1">
            {quickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={handleLinkClick}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                <link.icon className="mr-3 h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Forums
          </h3>
          <div className="space-y-1">
            {loading ? (
              <div className="text-sm text-gray-500 px-3 py-2">Loading forums...</div>
            ) : error ? (
              <div className="text-sm text-red-500 px-3 py-2">{error}</div>
            ) : forums.length === 0 ? (
              <div className="text-sm text-gray-500 px-3 py-2">No forums available</div>
            ) : (
              forums.map((forum) => {
                const ElementalIcon = getElementalIcon(forum.name);
                const elementalStyle = getElementalStyle(forum.name);
                return (
                  <Link
                    key={forum.id}
                    to={`/forum/${forum.id}`}
                    onClick={handleLinkClick}
                    className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                  >
                    <span className="flex items-center">
                      {ElementalIcon && (
                        <ElementalIcon className={`mr-2 h-4 w-4 ${elementalStyle}`} />
                      )}
                      <span>{forum.name}</span>
                    </span>
                    {forum.post_count !== undefined && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        {forum.post_count}
                      </span>
                    )}
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Mobile Auth Buttons */}
        <div className="block sm:hidden">
          {!isSignedIn && (
            <div className="space-y-2 pt-4 border-t">
              <Link to="/auth/login" className="w-full" onClick={handleLinkClick}>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/signup" className="w-full" onClick={handleLinkClick}>
                <Button className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}; 