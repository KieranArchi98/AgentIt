import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Sidebar } from './Sidebar';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <Sidebar className="w-64 flex-shrink-0" />
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
      <footer className="bg-white mt-auto border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 AgentIT Forum. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}; 