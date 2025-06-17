import { supabase } from './supabase';

// System user UUID (generated once and kept constant)
const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000001';

// Test data for posts
const testPosts = [
  {
    title: 'Welcome to the Technology Forum!',
    content: 'This is a test post about technology. Feel free to discuss the latest tech trends here.',
    forum_id: 'forum1',
    user_id: SYSTEM_USER_ID,
    votes: 5
  },
  {
    title: 'Gaming Discussion: Latest Releases',
    content: 'What games are you playing right now? Share your thoughts on recent releases!',
    forum_id: 'forum2',
    user_id: SYSTEM_USER_ID,
    votes: 3
  },
  {
    title: 'Science News: Latest Discoveries',
    content: 'Let\'s discuss recent scientific breakthroughs and discoveries!',
    forum_id: 'forum3',
    user_id: SYSTEM_USER_ID,
    votes: 4
  },
  {
    title: 'Movie Reviews: Latest Releases',
    content: 'Share your thoughts on the latest movies and upcoming releases!',
    forum_id: 'forum4',
    user_id: SYSTEM_USER_ID,
    votes: 2
  }
];

// Function to populate test data
export async function populateTestData() {
  try {
    console.log('Starting to populate test data...');

    // First verify we can connect to the database
    const { error: testError } = await supabase
      .from('forums')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('Database connection test failed:', testError);
      throw new Error(`Failed to connect to database: ${testError.message}`);
    }

    console.log('Database connection verified');

    // Create a system user profile if it doesn't exist
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: SYSTEM_USER_ID,
        username: 'System',
        avatar_url: null
      }, { 
        onConflict: 'id'
      });

    if (profileError) {
      console.error('Error creating system profile:', profileError);
      throw new Error(`Failed to create system profile: ${profileError.message}`);
    }

    console.log('System profile created/verified');

    // Clear existing posts
    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('user_id', SYSTEM_USER_ID); // Only delete system-generated posts

    if (deleteError) {
      console.error('Error deleting existing posts:', deleteError);
      throw new Error(`Failed to clear existing posts: ${deleteError.message}`);
    }

    console.log('Existing system posts cleared successfully');

    // Insert test posts one by one to better handle errors
    for (const post of testPosts) {
      console.log(`Inserting post: ${post.title}`);
      
      const { error: insertError } = await supabase
        .from('posts')
        .insert([{
          ...post,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (insertError) {
        console.error(`Error inserting post "${post.title}":`, insertError);
        throw new Error(`Failed to insert post "${post.title}": ${insertError.message}`);
      }
      
      console.log(`Successfully inserted post: ${post.title}`);
    }

    // Verify the posts were inserted
    const { data: verifyData, error: verifyError } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', SYSTEM_USER_ID);

    if (verifyError) {
      console.error('Error verifying inserted posts:', verifyError);
      throw new Error(`Failed to verify inserted posts: ${verifyError.message}`);
    }

    console.log(`All test data populated successfully. Total system posts: ${verifyData?.length ?? 0}`);
    return true;
  } catch (error) {
    console.error('Error populating test data:', error);
    throw error;
  }
} 