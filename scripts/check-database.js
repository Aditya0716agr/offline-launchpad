// Script to check Supabase connection and verify startup data
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

console.log('🔍 Checking Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT FOUND');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  try {
    console.log('\n📊 Checking database connection...');
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('startups')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Database connection failed:', testError.message);
      return;
    }
    
    console.log('✅ Database connection successful!');
    
    // Get all startups with their current logo URLs
    console.log('\n🚀 Fetching all startups...');
    const { data: startups, error: startupsError } = await supabase
      .from('startups')
      .select('id, name, slug, logo_url')
      .order('name');
    
    if (startupsError) {
      console.error('❌ Error fetching startups:', startupsError.message);
      return;
    }
    
    console.log(`📋 Found ${startups.length} startups:`);
    console.log('=' .repeat(80));
    
    startups.forEach((startup, index) => {
      console.log(`${index + 1}. ${startup.name}`);
      console.log(`   Slug: ${startup.slug}`);
      console.log(`   Logo: ${startup.logo_url || 'NO LOGO'}`);
      console.log('');
    });
    
    // Check specifically for the startups we tried to update
    console.log('\n🎯 Checking specific startups we updated:');
    const targetSlugs = [
      'blue-tokai-coffee-roasters',
      'epigamia-yogurt', 
      'sleepy-owl-coffee',
      'boat-lifestyle',
      'the-souled-store',
      'mamaearth',
      'curefoods',
      'cultfit',
      'kapiva-ayurveda',
      'wakefit',
      'pepperfry',
      'urban-ladder',
      'beco',
      'bambrew',
      'zerocircle'
    ];
    
    for (const slug of targetSlugs) {
      const startup = startups.find(s => s.slug === slug);
      if (startup) {
        const status = startup.logo_url && startup.logo_url.startsWith('/logos/') ? '✅' : '❌';
        console.log(`${status} ${startup.name}: ${startup.logo_url || 'NO LOGO'}`);
      } else {
        console.log(`❓ Startup with slug '${slug}' not found in database`);
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

checkDatabase();
