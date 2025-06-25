import { createClient } from '@supabase/supabase-js';

interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Log the URL (but not the key for security)
console.log('Initializing Supabase client with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test the connection
void (async () => {
  try {
    const { error } = await supabase.from('posts').select('count').limit(1);
    if (error) {
      console.error('Failed to connect to Supabase:', error);
    } else {
      console.log('Successfully connected to Supabase');
    }
  } catch (error: unknown) {
    console.error('Error testing Supabase connection:', error);
  }
})();

export type User = {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
};

// Helper functions for auth
export const signUp = async (email: string, password: string, username: string): Promise<void> => {
  try {
    // Check if username is taken first
    const { data: existingUser, error: usernameCheckError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (usernameCheckError) {
      console.error('Error checking username:', usernameCheckError);
      throw new Error('Failed to check username availability');
    }

    if (existingUser) {
      throw new Error('Username is already taken');
    }

    // Proceed with signup
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          username, // This will be used by the trigger to create the profile
        },
      },
    });

    if (signUpError) {
      if (signUpError.message.includes('security purposes')) {
        throw new Error('Please wait a moment before trying again');
      }
      console.error('Signup error:', signUpError);
      throw signUpError;
    }

    // Profile creation is now handled by the database trigger
    // No need to manually create the profile here

  } catch (error) {
    console.error('Signup process error:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error('Sign in error:', signInError);
      throw signInError;
    }

    if (!authData.user) {
      throw new Error('No user data returned after sign in');
    }

    // Verify profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw new Error('Failed to load user profile');
    }

    if (!profile) {
      throw new Error('Profile not found. Please verify your email first.');
    }

    return authData;
  } catch (error) {
    console.error('Sign in process error:', error);
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw error;
  return data;
}; 