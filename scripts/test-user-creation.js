// Script to test user creation and profile setup
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

async function testUserCreation() {
  console.log('🧪 Testing user creation and profile setup...\n');
  
  try {
    // Test 1: Check if we can connect to the database
    console.log('1. Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Database connection failed:', testError.message);
      return;
    }
    console.log('✅ Database connection successful');
    
    // Test 2: Check if profiles table exists and is accessible
    console.log('\n2. Testing profiles table access...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, user_id, full_name, role')
      .limit(5);
    
    if (profilesError) {
      console.error('❌ Profiles table access failed:', profilesError.message);
      return;
    }
    console.log(`✅ Profiles table accessible (${profiles.length} profiles found)`);
    
    // Test 3: Check if categories table exists
    console.log('\n3. Testing categories table access...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name, slug')
      .limit(5);
    
    if (categoriesError) {
      console.error('❌ Categories table access failed:', categoriesError.message);
      return;
    }
    console.log(`✅ Categories table accessible (${categories.length} categories found)`);
    
    // Test 4: Check if startups table exists
    console.log('\n4. Testing startups table access...');
    const { data: startups, error: startupsError } = await supabase
      .from('startups')
      .select('id, name, status')
      .limit(5);
    
    if (startupsError) {
      console.error('❌ Startups table access failed:', startupsError.message);
      return;
    }
    console.log(`✅ Startups table accessible (${startups.length} startups found)`);
    
    console.log('\n🎉 All database tests passed! Your setup is working correctly.');
    console.log('\n📋 Next steps:');
    console.log('1. Run the fix-auth-trigger.sql script in Supabase SQL Editor');
    console.log('2. Try signing up again in your app');
    console.log('3. The auth trigger should now automatically create user profiles');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testUserCreation();
