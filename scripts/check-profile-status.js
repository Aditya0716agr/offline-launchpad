// Check profile status and create if missing
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

async function checkProfileStatus() {
  console.log('🔍 Checking profile status...\n');
  
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Error getting user:', userError.message);
      return;
    }
    
    if (!user) {
      console.log('ℹ️  No authenticated user found');
      console.log('💡 Please sign up or log in first');
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
      console.log('❌ Profile not found for user');
      
      // Try to create profile
      console.log('🔧 Creating profile...');
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          full_name: user.email,
          role: 'user'
        })
        .select()
        .single();
      
      if (createError) {
        console.error('❌ Failed to create profile:', createError.message);
        
        // Try with service role key if available
        if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
          console.log('🔧 Trying with service role key...');
          const serviceSupabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);
          
          const { data: serviceProfile, error: serviceError } = await serviceSupabase
            .from('profiles')
            .insert({
              user_id: user.id,
              full_name: user.email,
              role: 'user'
            })
            .select()
            .single();
          
          if (serviceError) {
            console.error('❌ Service role creation also failed:', serviceError.message);
          } else {
            console.log('✅ Profile created with service role!');
            console.log('   Profile ID:', serviceProfile.id);
          }
        }
      } else {
        console.log('✅ Profile created successfully!');
        console.log('   Profile ID:', newProfile.id);
        console.log('   Role:', newProfile.role);
      }
    } else if (profileError) {
      console.error('❌ Error checking profile:', profileError.message);
    } else {
      console.log('✅ Profile exists:');
      console.log('   Profile ID:', profile.id);
      console.log('   Full Name:', profile.full_name);
      console.log('   Role:', profile.role);
    }
    
    // Check all profiles
    console.log('\n📋 All profiles in database:');
    const { data: allProfiles, error: allError } = await supabase
      .from('profiles')
      .select('id, user_id, full_name, role, created_at')
      .order('created_at', { ascending: false });
    
    if (allError) {
      console.error('❌ Error fetching all profiles:', allError.message);
    } else {
      allProfiles.forEach((p, index) => {
        console.log(`   ${index + 1}. ${p.full_name} (${p.role}) - ${p.created_at}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

checkProfileStatus();
