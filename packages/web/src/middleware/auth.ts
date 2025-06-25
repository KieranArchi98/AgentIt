//hook for syncing Clerk user info to Supabase.
import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { supabase } from '@/utils/apiClient';

export const useAuthSync = () => {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const syncUserToSupabase = async () => {
      if (!user || !isSignedIn) return;

      try {
        // Check if user exists in Supabase
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (!existingUser) {
          // Create new user profile in Supabase
          const { error } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              username: user.username || user.firstName || 'User',
              email: user.emailAddresses[0]?.emailAddress,
              avatar_url: user.imageUrl,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (error) throw error;
        } else {
          // Update existing user profile
          const { error } = await supabase
            .from('profiles')
            .update({
              username: user.username || user.firstName || 'User',
              email: user.emailAddresses[0]?.emailAddress,
              avatar_url: user.imageUrl,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);

          if (error) throw error;
        }
      } catch (error) {
        console.error('Error syncing user to Supabase:', error);
      }
    };

    syncUserToSupabase();
  }, [user, isSignedIn]);
}; 