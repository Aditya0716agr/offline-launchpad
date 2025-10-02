// Debug script to check profile creation issues
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

async function debugProfileCreation() {
  console.log('🔍 Debugging profile creation issues...\n');
  
  try {
    // Check current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Error getting user:', userError.message);
      return;
    }
    
    if (!user) {
      console.log('ℹ️  No authenticated user found');
      console.log('💡 Try signing up or logging in first');
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
    
    if (profileError) {
      if (profileError.code === 'PGRST116') {
        console.log('❌ Profile not found for user');
        console.log('💡 This is why you see "Unable to load dashboard"');
        
        // Try to create profile manually
        console.log('\n🔧 Attempting to create profile manually...');
        
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
          console.log('\n🔧 Possible solutions:');
          console.log('1. Run the safe-migration.sql script in Supabase SQL Editor');
          console.log('2. Check if the auth trigger is properly set up');
          console.log('3. Verify RLS policies allow profile creation');
        } else {
          console.log('✅ Profile created successfully!');
          console.log('   Profile ID:', newProfile.id);
          console.log('   Role:', newProfile.role);
          console.log('\n🎉 You should now be able to access the dashboard!');
        }
      } else {
        console.error('❌ Error checking profile:', profileError.message);
      }
    } else {
      console.log('✅ Profile found:');
      console.log('   Profile ID:', profile.id);
      console.log('   Full Name:', profile.full_name);
      console.log('   Role:', profile.role);
      console.log('   Created:', profile.created_at);
    }
    
    // Check auth trigger function
    console.log('\n🔍 Checking auth trigger function...');
    const { data: functions, error: funcError } = await supabase
      .rpc('handle_new_user', {})
      .then(() => ({ data: 'exists', error: null }))
      .catch(err => ({ data: null, error: err }));
    
    if (funcError) {
      console.log('⚠️  Auth trigger function may not exist or be accessible');
      console.log('💡 Run the safe-migration.sql script to set it up');
    } else {
      console.log('✅ Auth trigger function appears to be working');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

debugProfileCreation();
