// Script to check what tables and data exist in Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('🔍 Checking database tables and data...\n');
  
  // Check profiles table
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*');
  
  console.log('👤 PROFILES TABLE:');
  if (profilesError) {
    console.log('❌ Error:', profilesError.message);
  } else {
    console.log(`✅ Found ${profiles.length} profiles`);
    profiles.forEach(profile => {
      console.log(`   - ${profile.full_name || 'No name'} (${profile.role})`);
    });
  }
  
  // Check categories table
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*');
  
  console.log('\n🏷️ CATEGORIES TABLE:');
  if (categoriesError) {
    console.log('❌ Error:', categoriesError.message);
  } else {
    console.log(`✅ Found ${categories.length} categories`);
    categories.forEach(category => {
      console.log(`   - ${category.name} (${category.slug})`);
    });
  }
  
  // Check startups table
  const { data: startups, error: startupsError } = await supabase
    .from('startups')
    .select('*');
  
  console.log('\n🚀 STARTUPS TABLE:');
  if (startupsError) {
    console.log('❌ Error:', startupsError.message);
  } else {
    console.log(`✅ Found ${startups.length} startups`);
    startups.forEach(startup => {
      console.log(`   - ${startup.name} (${startup.slug}) - Status: ${startup.status}`);
    });
  }
  
  // Check votes table
  const { data: votes, error: votesError } = await supabase
    .from('votes')
    .select('*');
  
  console.log('\n👍 VOTES TABLE:');
  if (votesError) {
    console.log('❌ Error:', votesError.message);
  } else {
    console.log(`✅ Found ${votes.length} votes`);
  }
  
  // Check comments table
  const { data: comments, error: commentsError } = await supabase
    .from('comments')
    .select('*');
  
  console.log('\n💬 COMMENTS TABLE:');
  if (commentsError) {
    console.log('❌ Error:', commentsError.message);
  } else {
    console.log(`✅ Found ${comments.length} comments`);
  }
  
  // Check bookmarks table
  const { data: bookmarks, error: bookmarksError } = await supabase
    .from('bookmarks')
    .select('*');
  
  console.log('\n🔖 BOOKMARKS TABLE:');
  if (bookmarksError) {
    console.log('❌ Error:', bookmarksError.message);
  } else {
    console.log(`✅ Found ${bookmarks.length} bookmarks`);
  }
}

checkTables();
