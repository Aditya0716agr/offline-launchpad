// Debug script for dashboard loading issues
// Run this in the browser console when dashboard is stuck loading

console.log('🔍 Dashboard Loading Debug Script');
console.log('=====================================');

// Import Supabase client (assuming it's available globally)
const supabase = window.supabase || (() => {
  console.error('❌ Supabase client not found. Make sure you are on the dashboard page.');
  return null;
})();

if (!supabase) {
  console.log('💡 Please run this script on the dashboard page where Supabase is available.');
  return;
}

async function debugDashboardLoading() {
  console.log('\n🔍 Step 1: Checking authentication state...');
  
  // Check current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error('❌ Error getting user:', userError.message);
    return;
  }
  
  if (!user) {
    console.log('❌ No authenticated user found');
    console.log('💡 Solution: Please sign in first');
    return;
  }
  
  console.log('✅ User authenticated:', user.email);
  console.log('   User ID:', user.id);
  
  console.log('\n🔍 Step 2: Testing database connectivity...');
  
  // Test basic database connectivity
  try {
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Database connectivity test failed:', testError.message);
      console.log('💡 Possible solutions:');
      console.log('   - Check your internet connection');
      console.log('   - Verify Supabase project is active');
      console.log('   - Check if RLS policies are blocking access');
      return;
    }
    
    console.log('✅ Database connectivity test passed');
  } catch (error) {
    console.error('❌ Database connectivity error:', error.message);
    return;
  }
  
  console.log('\n🔍 Step 3: Checking profile existence...');
  
  // Check if profile exists
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  if (profileError) {
    if (profileError.code === 'PGRST116') {
      console.log('❌ Profile not found for user');
      console.log('💡 This is likely the cause of the loading issue');
      
      console.log('\n🔧 Step 4: Attempting to create profile...');
      
      // Try to create profile
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
        console.log('💡 Possible solutions:');
        console.log('   - Check RLS policies on profiles table');
        console.log('   - Verify user has permission to insert profiles');
        console.log('   - Run the emergency-profile-fix.sql script');
        console.log('   - Contact support if issue persists');
      } else {
        console.log('✅ Profile created successfully!');
        console.log('   Profile ID:', newProfile.id);
        console.log('   Role:', newProfile.role);
        console.log('🎉 Dashboard should now load properly. Please refresh the page.');
      }
    } else {
      console.error('❌ Error checking profile:', profileError.message);
      console.log('💡 This might be a database or permission issue');
    }
  } else {
    console.log('✅ Profile found:');
    console.log('   Profile ID:', profile.id);
    console.log('   Full Name:', profile.full_name);
    console.log('   Role:', profile.role);
    console.log('   Created:', profile.created_at);
    
    console.log('\n🤔 Profile exists but dashboard is still loading...');
    console.log('💡 Possible causes:');
    console.log('   - JavaScript error in dashboard component');
    console.log('   - Network timeout during startup loading');
    console.log('   - Infinite loop in profile checking logic');
    console.log('   - Browser cache issues');
    
    console.log('\n🔧 Try these solutions:');
    console.log('   1. Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)');
    console.log('   2. Clear browser cache and cookies');
    console.log('   3. Check browser console for JavaScript errors');
    console.log('   4. Try opening in an incognito/private window');
  }
  
  console.log('\n🔍 Step 5: Checking startups table access...');
  
  // Test startups table access
  try {
    const { data: startups, error: startupsError } = await supabase
      .from('startups')
      .select('id')
      .limit(1);
    
    if (startupsError) {
      console.error('❌ Error accessing startups table:', startupsError.message);
    } else {
      console.log('✅ Startups table accessible');
    }
  } catch (error) {
    console.error('❌ Startups table error:', error.message);
  }
  
  console.log('\n📋 Summary:');
  console.log('===========');
  console.log('If the dashboard is still stuck loading after this debug:');
  console.log('1. Check browser console for any JavaScript errors');
  console.log('2. Try the "Retry Loading" button on the dashboard');
  console.log('3. Clear browser cache and try again');
  console.log('4. Contact support with the debug output above');
}

// Run the debug function
debugDashboardLoading().catch(error => {
  console.error('❌ Debug script failed:', error);
});
