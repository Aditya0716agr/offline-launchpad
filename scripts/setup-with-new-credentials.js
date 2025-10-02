// Script to set up the new Supabase instance with your credentials
import { createClient } from '@supabase/supabase-js';

// Your new Supabase credentials
const supabaseUrl = 'https://hykljkoemvvelhhbhtyr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5a2xqa29lbXZ2ZWxoaGJodHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MjkyMjQsImV4cCI6MjA3NTAwNTIyNH0.fEP7s8bdug1M2NKy9pMr0Mk8fAbIPzBrgxk3Z2WbLms';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupNewSupabase() {
  console.log('🚀 Setting up your new Supabase instance...\n');
  
  try {
    // Test connection
    console.log('🔍 Testing connection...');
    const { data: testData, error: testError } = await supabase
      .from('startups')
      .select('count')
      .limit(1);
    
    if (testError && testError.code === 'PGRST116') {
      console.log('✅ Connection successful! (Tables not created yet - this is expected)');
    } else if (testError) {
      console.error('❌ Connection failed:', testError.message);
      return;
    } else {
      console.log('✅ Connection successful!');
    }
    
    console.log('\n📋 Next steps:');
    console.log('1. Update your .env file with these credentials:');
    console.log('   VITE_SUPABASE_URL="https://hykljkoemvvelhhbhtyr.supabase.co"');
    console.log('   VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5a2xqa29lbXZ2ZWxoaGJodHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MjkyMjQsImV4cCI6MjA3NTAwNTIyNH0.fEP7s8bdug1M2NKy9pMr0Mk8fAbIPzBrgxk3Z2WbLms"');
    console.log('   VITE_SUPABASE_PROJECT_ID="hykljkoemvvelhhbhtyr"');
    console.log('\n2. Go to your Supabase dashboard: https://supabase.com/dashboard/project/hykljkoemvvelhhbhtyr');
    console.log('3. Go to SQL Editor and run the setup script');
    console.log('4. Create a founder account in Authentication > Users');
    console.log('5. Run the seed script to populate with sample data');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setupNewSupabase();
