// Setup Storage Buckets for Startup Submissions
// Run this script to create the required storage buckets in Supabase

import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and anon key
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStorageBuckets() {
  console.log('Setting up storage buckets...');

  try {
    // Create startup-logos bucket
    const { data: logosBucket, error: logosError } = await supabase.storage.createBucket('startup-logos', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (logosError && !logosError.message.includes('already exists')) {
      console.error('Error creating startup-logos bucket:', logosError);
    } else {
      console.log('✅ startup-logos bucket created/verified');
    }

    // Create startup-covers bucket
    const { data: coversBucket, error: coversError } = await supabase.storage.createBucket('startup-covers', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      fileSizeLimit: 10485760 // 10MB
    });

    if (coversError && !coversError.message.includes('already exists')) {
      console.error('Error creating startup-covers bucket:', coversError);
    } else {
      console.log('✅ startup-covers bucket created/verified');
    }

    // Create startup-gallery bucket
    const { data: galleryBucket, error: galleryError } = await supabase.storage.createBucket('startup-gallery', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      fileSizeLimit: 10485760 // 10MB
    });

    if (galleryError && !galleryError.message.includes('already exists')) {
      console.error('Error creating startup-gallery bucket:', galleryError);
    } else {
      console.log('✅ startup-gallery bucket created/verified');
    }

    // List all buckets to verify
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
    } else {
      console.log('\n📦 Available buckets:');
      buckets.forEach(bucket => {
        console.log(`  - ${bucket.id} (public: ${bucket.public})`);
      });
    }

    console.log('\n🎉 Storage buckets setup complete!');
    console.log('\nNext steps:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to Storage > Policies');
    console.log('3. Make sure the storage policies are set up correctly');
    console.log('4. Test startup submission again');

  } catch (error) {
    console.error('Error setting up storage buckets:', error);
  }
}

// Run the setup
setupStorageBuckets();
