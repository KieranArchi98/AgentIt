import { supabase } from './supabase';

export async function initializeDatabase() {
  try {
    // Check if posts table exists by attempting to select from it
    const { error } = await supabase
      .from('posts')
      .select('count')
      .limit(1);

    if (error) {
      console.error(
        'Error checking database. Make sure to run the SQL setup script in your Supabase dashboard:',
        error
      );
      return false;
    }

    console.log('Database connection verified successfully');
    return true;
  } catch (error) {
    console.error('Error checking database:', error);
    return false;
  }
} 