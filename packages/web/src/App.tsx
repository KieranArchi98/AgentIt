import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
} 