import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogIn } from 'lucide-react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/lib/theme-provider';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const forumLinks = [
  { name: 'Technology', path: '/forum/forum1' },
  { name: 'Gaming', path: '/forum/forum2' },
  { name: 'Science', path: '/forum/forum3' },
  { name: 'Movies', path: '/forum/forum4' },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="font-bold text-primary-foreground">F</span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              Forums
            </span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-6">
            {forumLinks.map((forum) => (
              <Link
                key={forum.path}
                to={forum.path}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {forum.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <ThemeToggle />
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LogIn size={16} />
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
              <div className="grid gap-6 py-6">
                <div className="grid gap-2">
                  {forumLinks.map((forum) => (
                    <Link
                      key={forum.path}
                      to={forum.path}
                      className={cn(
                        "flex w-full items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-accent",
                        "transition-colors"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {forum.name}
                    </Link>
                  ))}
                </div>
                <Separator />
                <div className="grid gap-2">
                  <ThemeToggle />
                  {isSignedIn ? (
                    <UserButton afterSignOutUrl="/" />
                  ) : (
                    <>
                      <Link to="/login" className="w-full">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <LogIn size={16} />
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/signup" className="w-full">
                        <Button className="w-full">Sign Up</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
} 