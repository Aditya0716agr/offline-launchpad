// Debug script for explore page filters
// Run this in the browser console on the explore page

console.log('🔍 Explore Page Filters Debug Script');
console.log('=====================================');

// Import Supabase client (assuming it's available globally)
const supabase = window.supabase || (() => {
  console.error('❌ Supabase client not found. Make sure you are on the explore page.');
  return null;
})();

if (!supabase) {
  console.log('💡 Please run this script on the explore page where Supabase is available.');
  return;
}

async function debugExploreFilters() {
  console.log('\n🔍 Step 1: Testing basic startups query...');
  
  try {
    // Test basic query
    const { data: basicData, error: basicError } = await supabase
      .from('startups')
      .select('*')
      .eq('status', 'approved')
      .limit(5);
    
    if (basicError) {
      console.error('❌ Basic startups query failed:', basicError.message);
      return;
    }
    
    console.log('✅ Basic startups query successful');
    console.log('   Found startups:', basicData?.length || 0);
    if (basicData && basicData.length > 0) {
      console.log('   Sample startup:', {
        id: basicData[0].id,
        name: basicData[0].name,
        category_id: basicData[0].category_id,
        location: basicData[0].location
      });
    }
  } catch (error) {
    console.error('❌ Basic query error:', error.message);
    return;
  }
  
  console.log('\n🔍 Step 2: Testing categories query...');
  
  try {
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(10);
    
    if (categoriesError) {
      console.error('❌ Categories query failed:', categoriesError.message);
      console.log('💡 This might indicate the categories table doesn\'t exist or has different structure');
    } else {
      console.log('✅ Categories query successful');
      console.log('   Found categories:', categoriesData?.length || 0);
      if (categoriesData && categoriesData.length > 0) {
        console.log('   Sample category:', categoriesData[0]);
      }
    }
  } catch (error) {
    console.error('❌ Categories query error:', error.message);
  }
  
  console.log('\n🔍 Step 3: Testing startups with categories relationship...');
  
  try {
    const { data: startupsWithCategories, error: relationshipError } = await supabase
      .from('startups')
      .select(`
        *,
        categories (name, slug)
      `)
      .eq('status', 'approved')
      .limit(3);
    
    if (relationshipError) {
      console.error('❌ Startups with categories query failed:', relationshipError.message);
      console.log('💡 This indicates the relationship between startups and categories is not working');
      console.log('   Possible causes:');
      console.log('   - category_id column doesn\'t exist in startups table');
      console.log('   - categories table doesn\'t exist');
      console.log('   - Foreign key relationship is not set up properly');
    } else {
      console.log('✅ Startups with categories query successful');
      console.log('   Found startups with categories:', startupsWithCategories?.length || 0);
      if (startupsWithCategories && startupsWithCategories.length > 0) {
        console.log('   Sample startup with category:', {
          name: startupsWithCategories[0].name,
          category: startupsWithCategories[0].categories
        });
      }
    }
  } catch (error) {
    console.error('❌ Relationship query error:', error.message);
  }
  
  console.log('\n🔍 Step 4: Testing search functionality...');
  
  try {
    const { data: searchData, error: searchError } = await supabase
      .from('startups')
      .select('*')
      .eq('status', 'approved')
      .or('name.ilike.%test%,description.ilike.%test%')
      .limit(3);
    
    if (searchError) {
      console.error('❌ Search query failed:', searchError.message);
    } else {
      console.log('✅ Search query successful');
      console.log('   Found startups matching "test":', searchData?.length || 0);
    }
  } catch (error) {
    console.error('❌ Search query error:', error.message);
  }
  
  console.log('\n🔍 Step 5: Testing location filtering...');
  
  try {
    const { data: locationData, error: locationError } = await supabase
      .from('startups')
      .select('*')
      .eq('status', 'approved')
      .ilike('location', '%Mumbai%')
      .limit(3);
    
    if (locationError) {
      console.error('❌ Location filter query failed:', locationError.message);
    } else {
      console.log('✅ Location filter query successful');
      console.log('   Found startups in Mumbai:', locationData?.length || 0);
    }
  } catch (error) {
    console.error('❌ Location filter error:', error.message);
  }
  
  console.log('\n🔍 Step 6: Testing votes relationship...');
  
  try {
    const { data: votesData, error: votesError } = await supabase
      .from('startups')
      .select(`
        *,
        votes (id)
      `)
      .eq('status', 'approved')
      .limit(3);
    
    if (votesError) {
      console.error('❌ Votes relationship query failed:', votesError.message);
    } else {
      console.log('✅ Votes relationship query successful');
      console.log('   Found startups with votes:', votesData?.length || 0);
      if (votesData && votesData.length > 0) {
        console.log('   Sample startup votes:', {
          name: votesData[0].name,
          voteCount: votesData[0].votes?.length || 0
        });
      }
    }
  } catch (error) {
    console.error('❌ Votes relationship error:', error.message);
  }
  
  console.log('\n📋 Summary and Recommendations:');
  console.log('================================');
  console.log('Based on the debug results above:');
  console.log('');
  console.log('1. If basic startups query fails:');
  console.log('   - Check if startups table exists');
  console.log('   - Verify RLS policies allow reading approved startups');
  console.log('');
  console.log('2. If categories query fails:');
  console.log('   - Check if categories table exists');
  console.log('   - Verify the table structure matches the code expectations');
  console.log('');
  console.log('3. If relationship queries fail:');
  console.log('   - Check if category_id column exists in startups table');
  console.log('   - Verify foreign key relationships are set up');
  console.log('   - Consider using the fallback query approach');
  console.log('');
  console.log('4. If search/location filters fail:');
  console.log('   - Check column names and data types');
  console.log('   - Verify the ilike operator is supported');
  console.log('');
  console.log('5. General recommendations:');
  console.log('   - Check browser console for any JavaScript errors');
  console.log('   - Verify Supabase project is active and accessible');
  console.log('   - Test with different filter combinations');
}

// Run the debug function
debugExploreFilters().catch(error => {
  console.error('❌ Debug script failed:', error);
});
