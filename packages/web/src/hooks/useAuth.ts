import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/apiClient';

export const useAuth = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);

  useEffect(() => {
    const setupSupabase = async () => {
      if (!isSignedIn || !user) {
        setIsSupabaseReady(false);
        return;
      }

      try {
        // Get the JWT token from Clerk
        const token = await user.getToken({ template: 'supabase' });
        
        // Set the Supabase session
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: '',
        });

        if (sessionError) throw sessionError;

        setIsSupabaseReady(true);
      } catch (error) {
        console.error('Error setting up Supabase session:', error);
        setIsSupabaseReady(false);
      }
    };

    setupSupabase();

    // Set up a listener for token refresh
    const intervalId = setInterval(async () => {
      if (isSignedIn && user) {
        try {
          const token = await user.getToken({ template: 'supabase' });
          await supabase.auth.setSession({
            access_token: token,
            refresh_token: '',
          });
        } catch (error) {
          console.error('Error refreshing Supabase token:', error);
        }
      }
    }, 1000 * 60 * 55); // Refresh token every 55 minutes

    return () => clearInterval(intervalId);
  }, [user, isSignedIn]);

  return {
    isLoaded,
    isSignedIn,
    isSupabaseReady,
    user,
  };
}; 