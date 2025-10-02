import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugVoteBookmark() {
  console.log('🔍 Debugging vote and bookmark functionality...\n');

  try {
    // Test 1: Check if we can insert a test vote
    console.log('1. Testing vote insertion...');
    
    // Get a startup
    const { data: startups, error: startupsError } = await supabase
      .from('startups')
      .select('id, name')
      .limit(1);
    
    if (startupsError || !startups || startups.length === 0) {
      console.error('❌ No startups found');
      return;
    }
    
    const startup = startups[0];
    console.log(`✅ Found startup: ${startup.name} (${startup.id})`);
    
    // Get a profile
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .limit(1);
    
    if (profilesError || !profiles || profiles.length === 0) {
      console.error('❌ No profiles found');
      return;
    }
    
    const profile = profiles[0];
    console.log(`✅ Found profile: ${profile.full_name} (${profile.id})`);
    
    // Test vote insertion
    const { data: voteData, error: voteError } = await supabase
      .from('votes')
      .insert({
        user_id: profile.id,
        startup_id: startup.id
      })
      .select();
    
    if (voteError) {
      console.error('❌ Vote insertion failed:', voteError.message);
    } else {
      console.log('✅ Vote inserted successfully:', voteData);
      
      // Clean up - delete the test vote
      await supabase
        .from('votes')
        .delete()
        .eq('id', voteData[0].id);
      console.log('✅ Test vote cleaned up');
    }
    
    // Test bookmark insertion
    console.log('\n2. Testing bookmark insertion...');
    
    const { data: bookmarkData, error: bookmarkError } = await supabase
      .from('bookmarks')
      .insert({
        user_id: profile.id,
        startup_id: startup.id
      })
      .select();
    
    if (bookmarkError) {
      console.error('❌ Bookmark insertion failed:', bookmarkError.message);
    } else {
      console.log('✅ Bookmark inserted successfully:', bookmarkData);
      
      // Clean up - delete the test bookmark
      await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkData[0].id);
      console.log('✅ Test bookmark cleaned up');
    }
    
    console.log('\n🎉 All tests passed!');
    console.log('\n📋 The issue might be:');
    console.log('1. User authentication state not properly loaded in components');
    console.log('2. Components not properly handling loading states');
    console.log('3. Browser console errors preventing functionality');
    console.log('4. RLS policies blocking operations for anonymous users');

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugVoteBookmark();
