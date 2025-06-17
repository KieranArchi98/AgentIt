import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/lib/theme-provider';

const forumLinks = [
  { name: 'Forum 1', path: '/forum1' },
  { name: 'Forum 2', path: '/forum2' },
  { name: 'Forum 3', path: '/forum3' },
  { name: 'Forum 4', path: '/forum4' },
];

const MotionLink = motion(Link);
const MotionButton = motion(Button);

export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <MotionLink
            to="/"
            className="text-2xl font-bold text-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Forum
          </MotionLink>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <MotionLink
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') ? 'text-primary' : 'text-foreground hover:text-primary'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Home
            </MotionLink>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MotionButton
                  variant="ghost"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Forums
                </MotionButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {forumLinks.map((forum) => (
                  <DropdownMenuItem key={forum.path}>
                    <Link to={forum.path} className="w-full">
                      {forum.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />

            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <MotionButton
                asChild
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/login">Sign In</Link>
              </MotionButton>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center space-x-2">
            <ThemeToggle />
            {isSignedIn && <UserButton afterSignOutUrl="/" />}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-accent"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="sm:hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') ? 'text-primary' : 'text-foreground hover:text-primary'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            {forumLinks.map((forum) => (
              <Link
                key={forum.path}
                to={forum.path}
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {forum.name}
              </Link>
            ))}
            {!isSignedIn && (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
} 