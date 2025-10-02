// Script to seed the database with sample startup data
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Sample startup data
const sampleStartups = [
  {
    name: "Blue Tokai Coffee Roasters",
    slug: "blue-tokai-coffee-roasters",
    description: "Premium coffee roasters bringing you the finest single-origin and blended coffees from across India. We source directly from farmers and roast in small batches for maximum freshness.",
    logo_url: "/logos/blue-tokai.jpg",
    category: "Food & Beverage",
    location: "Mumbai, Maharashtra",
    website_url: "https://bluetokaicoffee.com",
    whatsapp_link: "https://wa.me/919876543210",
    status: "approved",
    tagline: "Fresh roasted coffee, delivered to your doorstep",
    stage: "Series A",
    team_size: "50-100",
    launch_date: "2015-01-15",
    is_featured: true,
    looking_for: ["Investment", "Partnerships", "Talent"],
    social_linkedin: "https://linkedin.com/company/blue-tokai",
    social_instagram: "https://instagram.com/bluetokaicoffee",
    social_twitter: "https://twitter.com/bluetokaicoffee"
  },
  {
    name: "Epigamia",
    slug: "epigamia-yogurt",
    description: "Greek yogurt brand focused on healthy, protein-rich dairy products. We make delicious yogurt with no artificial preservatives, perfect for health-conscious consumers.",
    logo_url: "/logos/epigamia.jpg",
    category: "Food & Beverage",
    location: "Mumbai, Maharashtra",
    website_url: "https://epigamia.in",
    whatsapp_link: "https://wa.me/919876543211",
    status: "approved",
    tagline: "Greek yogurt, Indian taste",
    stage: "Series B",
    team_size: "100-200",
    launch_date: "2016-03-20",
    is_featured: true,
    looking_for: ["Expansion", "New Markets"],
    social_linkedin: "https://linkedin.com/company/epigamia",
    social_instagram: "https://instagram.com/epigamia"
  },
  {
    name: "Sleepy Owl Coffee",
    slug: "sleepy-owl-coffee",
    description: "Cold brew coffee company making premium, ready-to-drink coffee beverages. Our cold brew is steeped for 16 hours to extract maximum flavor and caffeine.",
    logo_url: "/logos/sleepy-owl.jpg",
    category: "Food & Beverage",
    location: "Delhi, NCR",
    website_url: "https://sleepyowl.co",
    whatsapp_link: "https://wa.me/919876543212",
    status: "approved",
    tagline: "Cold brew coffee, anytime",
    stage: "Series A",
    team_size: "20-50",
    launch_date: "2016-08-10",
    is_featured: false,
    looking_for: ["Investment", "Distribution"],
    social_linkedin: "https://linkedin.com/company/sleepy-owl",
    social_instagram: "https://instagram.com/sleepyowlcoffee"
  },
  {
    name: "Boat Lifestyle",
    slug: "boat-lifestyle",
    description: "Audio and lifestyle accessories brand offering premium headphones, earphones, and smartwatches. We focus on quality, style, and affordability for the Indian market.",
    logo_url: "/logos/boat.jpg",
    category: "Retail & Fashion",
    location: "Mumbai, Maharashtra",
    website_url: "https://boat-lifestyle.com",
    whatsapp_link: "https://wa.me/919876543213",
    status: "approved",
    tagline: "Plug into Nirvana",
    stage: "Series C",
    team_size: "200-500",
    launch_date: "2016-11-05",
    is_featured: true,
    looking_for: ["Global Expansion", "New Product Lines"],
    social_linkedin: "https://linkedin.com/company/boat-lifestyle",
    social_instagram: "https://instagram.com/boat.lifestyle",
    social_twitter: "https://twitter.com/boat_lifestyle"
  },
  {
    name: "The Souled Store",
    slug: "the-souled-store",
    description: "Pop culture merchandise brand offering officially licensed t-shirts, hoodies, and accessories featuring characters from movies, TV shows, and anime.",
    logo_url: "/logos/souled-store.jpg",
    category: "Retail & Fashion",
    location: "Mumbai, Maharashtra",
    website_url: "https://thesouledstore.com",
    whatsapp_link: "https://wa.me/919876543214",
    status: "approved",
    tagline: "Express yourself with pop culture",
    stage: "Series B",
    team_size: "100-200",
    launch_date: "2013-12-01",
    is_featured: true,
    looking_for: ["Licensing Partnerships", "International Expansion"],
    social_linkedin: "https://linkedin.com/company/the-souled-store",
    social_instagram: "https://instagram.com/thesouledstore"
  },
  {
    name: "Mamaearth",
    slug: "mamaearth",
    description: "Natural and toxin-free personal care brand for babies and adults. We offer skincare, haircare, and baby care products made with natural ingredients.",
    logo_url: "/logos/mamaearth.jpg",
    category: "Beauty & Personal Care",
    location: "Gurgaon, Haryana",
    website_url: "https://mamaearth.in",
    whatsapp_link: "https://wa.me/919876543215",
    status: "approved",
    tagline: "Goodness Inside",
    stage: "Series D",
    team_size: "500+",
    launch_date: "2016-01-01",
    is_featured: true,
    looking_for: ["International Markets", "New Categories"],
    social_linkedin: "https://linkedin.com/company/mamaearth",
    social_instagram: "https://instagram.com/mamaearth",
    social_twitter: "https://twitter.com/mamaearth"
  },
  {
    name: "Curefoods",
    slug: "curefoods",
    description: "Cloud kitchen company operating multiple food brands across India. We focus on delivering high-quality, consistent food experiences through our network of kitchens.",
    logo_url: "/logos/curefoods.jpg",
    category: "Food & Beverage",
    location: "Bangalore, Karnataka",
    website_url: "https://curefoods.com",
    whatsapp_link: "https://wa.me/919876543216",
    status: "approved",
    tagline: "Food that cures your cravings",
    stage: "Series C",
    team_size: "200-500",
    launch_date: "2016-06-15",
    is_featured: true,
    looking_for: ["New Cities", "Brand Partnerships"],
    social_linkedin: "https://linkedin.com/company/curefoods",
    social_instagram: "https://instagram.com/curefoods"
  },
  {
    name: "Cultfit",
    slug: "cultfit",
    description: "Fitness and wellness platform offering gym memberships, personal training, and group fitness classes. We make fitness accessible and affordable for everyone.",
    logo_url: "/logos/cultfit.jpg",
    category: "Health & Wellness",
    location: "Bangalore, Karnataka",
    website_url: "https://cult.fit",
    whatsapp_link: "https://wa.me/919876543217",
    status: "approved",
    tagline: "Be Better Every Day",
    stage: "Series D",
    team_size: "1000+",
    launch_date: "2016-08-01",
    is_featured: true,
    looking_for: ["International Expansion", "Technology Innovation"],
    social_linkedin: "https://linkedin.com/company/cultfit",
    social_instagram: "https://instagram.com/cult.fit",
    social_twitter: "https://twitter.com/cultfit"
  },
  {
    name: "Kapiva Ayurveda",
    slug: "kapiva-ayurveda",
    description: "Ayurvedic health and wellness brand offering natural supplements, juices, and health products based on traditional Indian medicine principles.",
    logo_url: "/logos/kapiva.jpg",
    category: "Health & Wellness",
    location: "Mumbai, Maharashtra",
    website_url: "https://kapiva.in",
    whatsapp_link: "https://wa.me/919876543218",
    status: "approved",
    tagline: "Ancient wisdom, modern wellness",
    stage: "Series A",
    team_size: "50-100",
    launch_date: "2016-04-10",
    is_featured: false,
    looking_for: ["Product Development", "Market Expansion"],
    social_linkedin: "https://linkedin.com/company/kapiva",
    social_instagram: "https://instagram.com/kapiva"
  },
  {
    name: "Wakefit",
    slug: "wakefit",
    description: "Sleep solutions company offering mattresses, pillows, and sleep accessories. We focus on providing quality sleep products at affordable prices.",
    logo_url: "/logos/wakefit.jpg",
    category: "Home & Lifestyle",
    location: "Bangalore, Karnataka",
    website_url: "https://wakefit.co",
    whatsapp_link: "https://wa.me/919876543219",
    status: "approved",
    tagline: "Sleep well, live well",
    stage: "Series C",
    team_size: "200-500",
    launch_date: "2016-10-01",
    is_featured: true,
    looking_for: ["Product Innovation", "Retail Expansion"],
    social_linkedin: "https://linkedin.com/company/wakefit",
    social_instagram: "https://instagram.com/wakefit",
    social_twitter: "https://twitter.com/wakefit"
  },
  {
    name: "Pepperfry",
    slug: "pepperfry",
    description: "Online furniture and home decor marketplace offering a wide range of furniture, home accessories, and decor items for every room in your home.",
    logo_url: "/logos/pepperfry.jpg",
    category: "Home & Lifestyle",
    location: "Mumbai, Maharashtra",
    website_url: "https://pepperfry.com",
    whatsapp_link: "https://wa.me/919876543220",
    status: "approved",
    tagline: "Furniture that fits your life",
    stage: "Series E",
    team_size: "1000+",
    launch_date: "2012-01-01",
    is_featured: true,
    looking_for: ["International Markets", "Technology Enhancement"],
    social_linkedin: "https://linkedin.com/company/pepperfry",
    social_instagram: "https://instagram.com/pepperfry",
    social_twitter: "https://twitter.com/pepperfry"
  },
  {
    name: "Urban Ladder",
    slug: "urban-ladder",
    description: "Premium furniture and home decor brand offering curated furniture collections for modern Indian homes. We focus on quality, design, and customer service.",
    logo_url: "/logos/urban-ladder.jpg",
    category: "Home & Lifestyle",
    location: "Bangalore, Karnataka",
    website_url: "https://urbanladder.com",
    whatsapp_link: "https://wa.me/919876543221",
    status: "approved",
    tagline: "Beautiful homes for beautiful people",
    stage: "Series D",
    team_size: "500-1000",
    launch_date: "2012-07-01",
    is_featured: true,
    looking_for: ["Market Expansion", "Product Innovation"],
    social_linkedin: "https://linkedin.com/company/urban-ladder",
    social_instagram: "https://instagram.com/urbanladder"
  },
  {
    name: "Beco",
    slug: "beco",
    description: "Sustainable personal care brand offering eco-friendly products like bamboo toothbrushes, biodegradable sanitary pads, and natural skincare products.",
    logo_url: "/logos/beco.jpg",
    category: "Sustainable Products",
    location: "Mumbai, Maharashtra",
    website_url: "https://beco.in",
    whatsapp_link: "https://wa.me/919876543222",
    status: "approved",
    tagline: "Sustainable choices for a better tomorrow",
    stage: "Series A",
    team_size: "20-50",
    launch_date: "2017-03-15",
    is_featured: false,
    looking_for: ["Product Development", "Sustainability Partnerships"],
    social_linkedin: "https://linkedin.com/company/beco",
    social_instagram: "https://instagram.com/beco"
  },
  {
    name: "Bambrew",
    slug: "bambrew",
    description: "Sustainable packaging solutions company offering bamboo-based alternatives to plastic packaging. We help businesses reduce their environmental footprint.",
    logo_url: "/logos/bambrew.jpg",
    category: "Sustainable Products",
    location: "Bangalore, Karnataka",
    website_url: "https://bambrew.com",
    whatsapp_link: "https://wa.me/919876543223",
    status: "approved",
    tagline: "Packaging that doesn't cost the earth",
    stage: "Series A",
    team_size: "50-100",
    launch_date: "2018-01-20",
    is_featured: false,
    looking_for: ["B2B Partnerships", "Technology Innovation"],
    social_linkedin: "https://linkedin.com/company/bambrew",
    social_instagram: "https://instagram.com/bambrew"
  },
  {
    name: "ZeroCircle",
    slug: "zerocircle",
    description: "Climate tech startup focused on carbon capture and sustainable solutions. We help businesses achieve net-zero emissions through innovative technology.",
    logo_url: "/logos/zerocircle.jpg",
    category: "Sustainable Products",
    location: "Mumbai, Maharashtra",
    website_url: "https://zerocircle.com",
    whatsapp_link: "https://wa.me/919876543224",
    status: "approved",
    tagline: "Towards a zero-carbon future",
    stage: "Seed",
    team_size: "10-20",
    launch_date: "2020-06-01",
    is_featured: false,
    looking_for: ["Investment", "Technology Partners", "Pilot Projects"],
    social_linkedin: "https://linkedin.com/company/zerocircle",
    social_instagram: "https://instagram.com/zerocircle"
  }
];

async function seedStartups() {
  console.log('🌱 Seeding database with sample startups...\n');
  
  // First, get the founder profile ID
  const { data: founderProfile, error: founderError } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'founder')
    .limit(1)
    .single();
  
  if (founderError || !founderProfile) {
    console.error('❌ No founder profile found. Please create a founder profile first.');
    return;
  }
  
  console.log(`✅ Using founder profile: ${founderProfile.id}`);
  
  // Get category mapping
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name');
  
  if (categoriesError) {
    console.error('❌ Error fetching categories:', categoriesError.message);
    return;
  }
  
  const categoryMap = {};
  categories.forEach(cat => {
    categoryMap[cat.name] = cat.id;
  });
  
  console.log('✅ Categories loaded:', Object.keys(categoryMap).join(', '));
  
  // Insert startups
  let successCount = 0;
  let errorCount = 0;
  
  for (const startup of sampleStartups) {
    try {
      const startupData = {
        ...startup,
        founder_id: founderProfile.id,
        category_id: categoryMap[startup.category] || null,
        view_count: Math.floor(Math.random() * 1000) + 100, // Random view count
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Remove the category field since we're using category_id
      delete startupData.category;
      
      const { data, error } = await supabase
        .from('startups')
        .insert(startupData)
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Error inserting ${startup.name}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Inserted: ${startup.name}`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Exception inserting ${startup.name}:`, err.message);
      errorCount++;
    }
  }
  
  console.log(`\n🎉 Seeding completed!`);
  console.log(`✅ Successfully inserted: ${successCount} startups`);
  console.log(`❌ Errors: ${errorCount} startups`);
}

seedStartups();
