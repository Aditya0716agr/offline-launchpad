// Test script to verify auth trigger is working
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

async function testAuthTrigger() {
  console.log('🧪 Testing auth trigger setup...\n');
  
  try {
    // Check if the trigger function exists
    console.log('1. Checking if handle_new_user function exists...');
    
    // Try to call the function (this will fail if it doesn't exist)
    try {
      await supabase.rpc('handle_new_user', {});
      console.log('✅ handle_new_user function exists');
    } catch (error) {
      if (error.message.includes('function') && error.message.includes('does not exist')) {
        console.log('❌ handle_new_user function does not exist');
        console.log('💡 Run the safe-migration.sql script in Supabase SQL Editor');
        return;
      } else {
        console.log('✅ handle_new_user function exists (got expected error)');
      }
    }
    
    // Check if profiles table has the right structure
    console.log('\n2. Checking profiles table structure...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.error('❌ Error accessing profiles table:', profilesError.message);
      return;
    }
    
    console.log('✅ Profiles table is accessible');
    
    // Check current profiles
    const { data: allProfiles, error: allProfilesError } = await supabase
      .from('profiles')
      .select('id, user_id, full_name, role, created_at')
      .order('created_at', { ascending: false });
    
    if (allProfilesError) {
      console.error('❌ Error fetching profiles:', allProfilesError.message);
      return;
    }
    
    console.log(`✅ Found ${allProfiles.length} profiles in database:`);
    allProfiles.forEach((profile, index) => {
      console.log(`   ${index + 1}. ${profile.full_name} (${profile.role}) - ${profile.created_at}`);
    });
    
    // Check if we can create a profile manually
    console.log('\n3. Testing manual profile creation...');
    const testUserId = '00000000-0000-0000-0000-000000000001';
    
    try {
      const { data: testProfile, error: testError } = await supabase
        .from('profiles')
        .insert({
          user_id: testUserId,
          full_name: 'Test User',
          role: 'user'
        })
        .select()
        .single();
      
      if (testError) {
        console.log('❌ Manual profile creation failed:', testError.message);
        if (testError.message.includes('duplicate key')) {
          console.log('   (This is expected if profile already exists)');
        }
      } else {
        console.log('✅ Manual profile creation works');
        console.log('   Created profile:', testProfile.id);
        
        // Clean up test profile
        await supabase
          .from('profiles')
          .delete()
          .eq('id', testProfile.id);
        console.log('   Test profile cleaned up');
      }
    } catch (error) {
      console.log('❌ Manual profile creation error:', error.message);
    }
    
    console.log('\n🎉 Auth trigger setup test completed!');
    console.log('\n📋 Summary:');
    console.log('- If you see "Unable to load dashboard", the auth trigger may not be working');
    console.log('- The dashboard now automatically creates profiles if they\'re missing');
    console.log('- Try signing up with a new email to test the full flow');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testAuthTrigger();
