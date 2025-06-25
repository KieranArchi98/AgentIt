import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export const AuthCallbackPage = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the session from URL
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (!session) {
          // Try to exchange the code for a session
          const { error: confirmError } = await supabase.auth.exchangeCodeForSession(window.location.href);
          if (confirmError) throw confirmError;
        }

        // Get the user after confirmation
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('User error:', userError);
          throw userError;
        }

        if (!user) {
          throw new Error('No user found after confirmation');
        }

        // Profile is now created by the database trigger
        // Just verify it exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Profile error:', profileError);
          throw profileError;
        }

        if (!profile) {
          throw new Error('Profile not found after confirmation');
        }

        // Redirect to home page
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Error in email confirmation:', err);
        setError(err instanceof Error ? err.message : 'An error occurred during confirmation');
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => navigate('/sign-in')}
          className="text-primary hover:underline"
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}; 