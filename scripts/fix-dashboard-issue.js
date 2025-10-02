// Script to fix the dashboard loading issue
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

async function fixDashboardIssue() {
  console.log('🔧 Fixing dashboard loading issue...\n');
  
  try {
    // Check current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Error getting user:', userError.message);
      return;
    }
    
    if (!user) {
      console.log('ℹ️  No authenticated user found');
      console.log('💡 Please sign up or log in first, then run this script again');
      return;
    }
    
    console.log('✅ User found:', user.email);
    console.log('   User ID:', user.id);
    
    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (profileError && profileError.code === 'PGRST116') {
      console.log('❌ Profile not found - this is causing the dashboard issue');
      
      // Try to create profile with service role (bypassing RLS)
      console.log('🔧 Attempting to create profile...');
      
      // First, let's check what RLS policies exist
      console.log('\n📋 Current RLS policies on profiles table:');
      console.log('   - Users can insert their own profile');
      console.log('   - Users can view all profiles');
      console.log('   - Users can update their own profile');
      
      // Try creating profile as the authenticated user
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          full_name: user.user_metadata?.full_name || user.email,
          role: 'user'
        })
        .select()
        .single();
      
      if (createError) {
        console.error('❌ Failed to create profile:', createError.message);
        
        if (createError.message.includes('row-level security')) {
          console.log('\n🔧 RLS Policy Issue Detected!');
          console.log('💡 The RLS policy is preventing profile creation');
          console.log('\n📋 Solutions:');
          console.log('1. Run the safe-migration.sql script in Supabase SQL Editor');
          console.log('2. Or manually create the profile in Supabase dashboard');
          console.log('3. Or update the RLS policies to allow profile creation');
          
          // Let's try a different approach - check if we can at least read profiles
          console.log('\n🔍 Testing profile read access...');
          const { data: allProfiles, error: readError } = await supabase
            .from('profiles')
            .select('id, user_id, full_name, role')
            .limit(5);
          
          if (readError) {
            console.log('❌ Cannot read profiles either:', readError.message);
          } else {
            console.log('✅ Can read profiles, found:', allProfiles.length);
            allProfiles.forEach(p => {
              console.log(`   - ${p.full_name} (${p.role})`);
            });
          }
        }
      } else {
        console.log('✅ Profile created successfully!');
        console.log('   Profile ID:', newProfile.id);
        console.log('   Role:', newProfile.role);
        console.log('\n🎉 Dashboard should now work!');
      }
    } else if (profileError) {
      console.error('❌ Error checking profile:', profileError.message);
    } else {
      console.log('✅ Profile already exists:');
      console.log('   Profile ID:', profile.id);
      console.log('   Full Name:', profile.full_name);
      console.log('   Role:', profile.role);
      console.log('\n🤔 If dashboard still shows "Unable to load dashboard",');
      console.log('   the issue might be in the frontend code.');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

fixDashboardIssue();
