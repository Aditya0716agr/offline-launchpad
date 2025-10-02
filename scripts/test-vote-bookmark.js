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

async function testVoteBookmark() {
  console.log('🧪 Testing vote and bookmark functionality...\n');

  try {
    // Test 1: Check if we can access the tables
    console.log('1. Testing table access...');
    
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('*')
      .limit(1);
    
    if (votesError) {
      console.error('❌ Votes table error:', votesError.message);
    } else {
      console.log('✅ Votes table accessible');
    }

    const { data: bookmarks, error: bookmarksError } = await supabase
      .from('bookmarks')
      .select('*')
      .limit(1);
    
    if (bookmarksError) {
      console.error('❌ Bookmarks table error:', bookmarksError.message);
    } else {
      console.log('✅ Bookmarks table accessible');
    }

    // Test 2: Check if we can get a startup
    console.log('\n2. Testing startup access...');
    
    const { data: startups, error: startupsError } = await supabase
      .from('startups')
      .select('id, name')
      .limit(1);
    
    if (startupsError) {
      console.error('❌ Startups table error:', startupsError.message);
    } else if (startups && startups.length > 0) {
      console.log('✅ Startups accessible:', startups[0].name);
    } else {
      console.log('⚠️ No startups found');
    }

    // Test 3: Check if we can get a profile
    console.log('\n3. Testing profile access...');
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .limit(1);
    
    if (profilesError) {
      console.error('❌ Profiles table error:', profilesError.message);
    } else if (profiles && profiles.length > 0) {
      console.log('✅ Profiles accessible:', profiles[0].full_name);
    } else {
      console.log('⚠️ No profiles found');
    }

    console.log('\n🎉 Test completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Check browser console for any JavaScript errors');
    console.log('2. Verify user is logged in');
    console.log('3. Check if VoteButton and BookmarkButton components are properly imported');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testVoteBookmark();
