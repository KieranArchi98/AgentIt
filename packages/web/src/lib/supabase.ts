import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Log the URL (but not the key for security)
console.log('Initializing Supabase client with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey);

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