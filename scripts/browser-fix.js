// Browser console fix for profile creation
// Copy and paste this into your browser console while on the dashboard page

console.log('🔧 Running browser fix for profile creation...');

// Get the supabase client from the page
const supabase = window.supabase || window.__supabase;

if (!supabase) {
  console.error('❌ Supabase client not found on page');
  console.log('💡 Make sure you are on the dashboard page');
} else {
  console.log('✅ Supabase client found');
  
  // Get current user
  supabase.auth.getUser().then(async ({ data: { user }, error: userError }) => {
    if (userError) {
      console.error('❌ Error getting user:', userError.message);
      return;
    }
    
    if (!user) {
      console.log('ℹ️  No authenticated user found');
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
      console.log('❌ Profile not found - creating one...');
      
      // Try to create profile
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
        console.log('💡 Run the emergency-profile-fix.sql script in Supabase SQL Editor');
      } else {
        console.log('✅ Profile created successfully!');
        console.log('   Profile ID:', newProfile.id);
        console.log('🎉 Now refresh the page - dashboard should work!');
      }
    } else if (profileError) {
      console.error('❌ Error checking profile:', profileError.message);
    } else {
      console.log('✅ Profile already exists:');
      console.log('   Profile ID:', profile.id);
      console.log('   Role:', profile.role);
      console.log('🤔 If dashboard still shows "Setting up your profile...", try refreshing the page');
    }
  });
}

console.log('📋 Instructions:');
console.log('1. Copy and paste this entire script into your browser console');
console.log('2. Press Enter to run it');
console.log('3. Follow the instructions in the output');
console.log('4. Refresh the dashboard page');
