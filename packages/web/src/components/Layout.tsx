import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Footer } from './layout/Footer';
import { Sidebar } from './Sidebar';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 container py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <Sidebar className="hidden lg:block w-64 flex-shrink-0" />
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}; 