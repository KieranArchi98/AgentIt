import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export const useRedirectAfterAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn } = useUser();

  useEffect(() => {
    // Only redirect if user is signed in and trying to access auth pages
    if (isSignedIn && location.pathname.startsWith('/auth/')) {
      // Get the redirect path from location state, or default to home
      const from = (location.state as { from?: Location })?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isSignedIn, navigate, location]);
}; 