// Script to update startup logo URLs in Supabase
// Run this with: node scripts/update-logos.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const logoUpdates = [
  { slug: 'blue-tokai-coffee-roasters', logo: '/logos/blue-tokai.jpg' },
  { slug: 'epigamia-yogurt', logo: '/logos/epigamia.jpg' },
  { slug: 'sleepy-owl-coffee', logo: '/logos/sleepy-owl.jpg' },
  { slug: 'boat-lifestyle', logo: '/logos/boat.jpg' },
  { slug: 'the-souled-store', logo: '/logos/souled-store.jpg' },
  { slug: 'mamaearth', logo: '/logos/mamaearth.jpg' },
  { slug: 'curefoods', logo: '/logos/curefoods.jpg' },
  { slug: 'cultfit', logo: '/logos/cultfit.jpg' },
  { slug: 'kapiva-ayurveda', logo: '/logos/kapiva.jpg' },
  { slug: 'wakefit', logo: '/logos/wakefit.jpg' },
  { slug: 'pepperfry', logo: '/logos/pepperfry.jpg' },
  { slug: 'urban-ladder', logo: '/logos/urban-ladder.jpg' },
  { slug: 'beco', logo: '/logos/beco.jpg' },
  { slug: 'bambrew', logo: '/logos/bambrew.jpg' },
  { slug: 'zerocircle', logo: '/logos/zerocircle.jpg' }
];

async function updateLogos() {
  console.log('🔄 Updating startup logo URLs...');
  
  for (const update of logoUpdates) {
    try {
      const { data, error } = await supabase
        .from('startups')
        .update({ logo_url: update.logo })
        .eq('slug', update.slug);
      
      if (error) {
        console.error(`❌ Error updating ${update.slug}:`, error.message);
      } else {
        console.log(`✅ Updated ${update.slug} -> ${update.logo}`);
      }
    } catch (err) {
      console.error(`❌ Exception updating ${update.slug}:`, err.message);
    }
  }
  
  console.log('🎉 Logo update process completed!');
}

updateLogos();
