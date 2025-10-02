-- Seed script that temporarily disables foreign key constraints
-- Run this AFTER running the setup script

-- Temporarily disable foreign key constraint checking
SET session_replication_role = replica;

-- Create a temporary founder profile with a placeholder user_id
INSERT INTO profiles (user_id, full_name, role, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000000', -- Placeholder UUID
    'Sample Founder',
    'founder',
    NOW(),
    NOW()
) ON CONFLICT (user_id) DO NOTHING;

-- Re-enable foreign key constraint checking
SET session_replication_role = DEFAULT;

-- Get the founder profile ID and insert startups
DO $$
DECLARE
    founder_profile_id UUID;
BEGIN
    -- Get the founder profile ID
    SELECT id INTO founder_profile_id FROM profiles WHERE role = 'founder' LIMIT 1;
    
    -- Insert sample startups
    INSERT INTO startups (
        founder_id,
        name,
        slug,
        description,
        logo_url,
        category_id,
        location,
        website_url,
        whatsapp_link,
        status,
        tagline,
        stage,
        team_size,
        launch_date,
        is_featured,
        looking_for,
        social_linkedin,
        social_instagram,
        social_twitter,
        view_count,
        created_at,
        updated_at
    ) VALUES 
    -- Blue Tokai Coffee Roasters
    (
        founder_profile_id,
        'Blue Tokai Coffee Roasters',
        'blue-tokai-coffee-roasters',
        'Premium coffee roasters bringing you the finest single-origin and blended coffees from across India. We source directly from farmers and roast in small batches for maximum freshness.',
        '/logos/blue-tokai.jpg',
        (SELECT id FROM categories WHERE name = 'Food & Beverage'),
        'Mumbai, Maharashtra',
        'https://bluetokaicoffee.com',
        'https://wa.me/919876543210',
        'approved',
        'Fresh roasted coffee, delivered to your doorstep',
        'Series A',
        '50-100',
        '2015-01-15',
        true,
        ARRAY['Investment', 'Partnerships', 'Talent'],
        'https://linkedin.com/company/blue-tokai',
        'https://instagram.com/bluetokaicoffee',
        'https://twitter.com/bluetokaicoffee',
        1250,
        NOW(),
        NOW()
    ),
    -- Epigamia
    (
        founder_profile_id,
        'Epigamia',
        'epigamia-yogurt',
        'Greek yogurt brand focused on healthy, protein-rich dairy products. We make delicious yogurt with no artificial preservatives, perfect for health-conscious consumers.',
        '/logos/epigamia.jpg',
        (SELECT id FROM categories WHERE name = 'Food & Beverage'),
        'Mumbai, Maharashtra',
        'https://epigamia.in',
        'https://wa.me/919876543211',
        'approved',
        'Greek yogurt, Indian taste',
        'Series B',
        '100-200',
        '2016-03-20',
        true,
        ARRAY['Expansion', 'New Markets'],
        'https://linkedin.com/company/epigamia',
        'https://instagram.com/epigamia',
        NULL,
        980,
        NOW(),
        NOW()
    ),
    -- Sleepy Owl Coffee
    (
        founder_profile_id,
        'Sleepy Owl Coffee',
        'sleepy-owl-coffee',
        'Cold brew coffee company making premium, ready-to-drink coffee beverages. Our cold brew is steeped for 16 hours to extract maximum flavor and caffeine.',
        '/logos/sleepy-owl.jpg',
        (SELECT id FROM categories WHERE name = 'Food & Beverage'),
        'Delhi, NCR',
        'https://sleepyowl.co',
        'https://wa.me/919876543212',
        'approved',
        'Cold brew coffee, anytime',
        'Series A',
        '20-50',
        '2016-08-10',
        false,
        ARRAY['Investment', 'Distribution'],
        'https://linkedin.com/company/sleepy-owl',
        'https://instagram.com/sleepyowlcoffee',
        NULL,
        750,
        NOW(),
        NOW()
    ),
    -- Boat Lifestyle
    (
        founder_profile_id,
        'Boat Lifestyle',
        'boat-lifestyle',
        'Audio and lifestyle accessories brand offering premium headphones, earphones, and smartwatches. We focus on quality, style, and affordability for the Indian market.',
        '/logos/boat.jpg',
        (SELECT id FROM categories WHERE name = 'Retail & Fashion'),
        'Mumbai, Maharashtra',
        'https://boat-lifestyle.com',
        'https://wa.me/919876543213',
        'approved',
        'Plug into Nirvana',
        'Series C',
        '200-500',
        '2016-11-05',
        true,
        ARRAY['Global Expansion', 'New Product Lines'],
        'https://linkedin.com/company/boat-lifestyle',
        'https://instagram.com/boat.lifestyle',
        'https://twitter.com/boat_lifestyle',
        2100,
        NOW(),
        NOW()
    ),
    -- The Souled Store
    (
        founder_profile_id,
        'The Souled Store',
        'the-souled-store',
        'Pop culture merchandise brand offering officially licensed t-shirts, hoodies, and accessories featuring characters from movies, TV shows, and anime.',
        '/logos/souled-store.jpg',
        (SELECT id FROM categories WHERE name = 'Retail & Fashion'),
        'Mumbai, Maharashtra',
        'https://thesouledstore.com',
        'https://wa.me/919876543214',
        'approved',
        'Express yourself with pop culture',
        'Series B',
        '100-200',
        '2013-12-01',
        true,
        ARRAY['Licensing Partnerships', 'International Expansion'],
        'https://linkedin.com/company/the-souled-store',
        'https://instagram.com/thesouledstore',
        NULL,
        1650,
        NOW(),
        NOW()
    ),
    -- Mamaearth
    (
        founder_profile_id,
        'Mamaearth',
        'mamaearth',
        'Natural and toxin-free personal care brand for babies and adults. We offer skincare, haircare, and baby care products made with natural ingredients.',
        '/logos/mamaearth.jpg',
        (SELECT id FROM categories WHERE name = 'Beauty & Personal Care'),
        'Gurgaon, Haryana',
        'https://mamaearth.in',
        'https://wa.me/919876543215',
        'approved',
        'Goodness Inside',
        'Series D',
        '500+',
        '2016-01-01',
        true,
        ARRAY['International Markets', 'New Categories'],
        'https://linkedin.com/company/mamaearth',
        'https://instagram.com/mamaearth',
        'https://twitter.com/mamaearth',
        3200,
        NOW(),
        NOW()
    ),
    -- Curefoods
    (
        founder_profile_id,
        'Curefoods',
        'curefoods',
        'Cloud kitchen company operating multiple food brands across India. We focus on delivering high-quality, consistent food experiences through our network of kitchens.',
        '/logos/curefoods.jpg',
        (SELECT id FROM categories WHERE name = 'Food & Beverage'),
        'Bangalore, Karnataka',
        'https://curefoods.com',
        'https://wa.me/919876543216',
        'approved',
        'Food that cures your cravings',
        'Series C',
        '200-500',
        '2016-06-15',
        true,
        ARRAY['New Cities', 'Brand Partnerships'],
        'https://linkedin.com/company/curefoods',
        'https://instagram.com/curefoods',
        NULL,
        1800,
        NOW(),
        NOW()
    ),
    -- Cultfit
    (
        founder_profile_id,
        'Cultfit',
        'cultfit',
        'Fitness and wellness platform offering gym memberships, personal training, and group fitness classes. We make fitness accessible and affordable for everyone.',
        '/logos/cultfit.jpg',
        (SELECT id FROM categories WHERE name = 'Health & Wellness'),
        'Bangalore, Karnataka',
        'https://cult.fit',
        'https://wa.me/919876543217',
        'approved',
        'Be Better Every Day',
        'Series D',
        '1000+',
        '2016-08-01',
        true,
        ARRAY['International Expansion', 'Technology Innovation'],
        'https://linkedin.com/company/cultfit',
        'https://instagram.com/cult.fit',
        'https://twitter.com/cultfit',
        2800,
        NOW(),
        NOW()
    ),
    -- Kapiva Ayurveda
    (
        founder_profile_id,
        'Kapiva Ayurveda',
        'kapiva-ayurveda',
        'Ayurvedic health and wellness brand offering natural supplements, juices, and health products based on traditional Indian medicine principles.',
        '/logos/kapiva.jpg',
        (SELECT id FROM categories WHERE name = 'Health & Wellness'),
        'Mumbai, Maharashtra',
        'https://kapiva.in',
        'https://wa.me/919876543218',
        'approved',
        'Ancient wisdom, modern wellness',
        'Series A',
        '50-100',
        '2016-04-10',
        false,
        ARRAY['Product Development', 'Market Expansion'],
        'https://linkedin.com/company/kapiva',
        'https://instagram.com/kapiva',
        NULL,
        650,
        NOW(),
        NOW()
    ),
    -- Wakefit
    (
        founder_profile_id,
        'Wakefit',
        'wakefit',
        'Sleep solutions company offering mattresses, pillows, and sleep accessories. We focus on providing quality sleep products at affordable prices.',
        '/logos/wakefit.jpg',
        (SELECT id FROM categories WHERE name = 'Home & Lifestyle'),
        'Bangalore, Karnataka',
        'https://wakefit.co',
        'https://wa.me/919876543219',
        'approved',
        'Sleep well, live well',
        'Series C',
        '200-500',
        '2016-10-01',
        true,
        ARRAY['Product Innovation', 'Retail Expansion'],
        'https://linkedin.com/company/wakefit',
        'https://instagram.com/wakefit',
        'https://twitter.com/wakefit',
        1950,
        NOW(),
        NOW()
    ),
    -- Pepperfry
    (
        founder_profile_id,
        'Pepperfry',
        'pepperfry',
        'Online furniture and home decor marketplace offering a wide range of furniture, home accessories, and decor items for every room in your home.',
        '/logos/pepperfry.jpg',
        (SELECT id FROM categories WHERE name = 'Home & Lifestyle'),
        'Mumbai, Maharashtra',
        'https://pepperfry.com',
        'https://wa.me/919876543220',
        'approved',
        'Furniture that fits your life',
        'Series E',
        '1000+',
        '2012-01-01',
        true,
        ARRAY['International Markets', 'Technology Enhancement'],
        'https://linkedin.com/company/pepperfry',
        'https://instagram.com/pepperfry',
        'https://twitter.com/pepperfry',
        4200,
        NOW(),
        NOW()
    ),
    -- Urban Ladder
    (
        founder_profile_id,
        'Urban Ladder',
        'urban-ladder',
        'Premium furniture and home decor brand offering curated furniture collections for modern Indian homes. We focus on quality, design, and customer service.',
        '/logos/urban-ladder.jpg',
        (SELECT id FROM categories WHERE name = 'Home & Lifestyle'),
        'Bangalore, Karnataka',
        'https://urbanladder.com',
        'https://wa.me/919876543221',
        'approved',
        'Beautiful homes for beautiful people',
        'Series D',
        '500-1000',
        '2012-07-01',
        true,
        ARRAY['Market Expansion', 'Product Innovation'],
        'https://linkedin.com/company/urban-ladder',
        'https://instagram.com/urbanladder',
        NULL,
        3100,
        NOW(),
        NOW()
    ),
    -- Beco
    (
        founder_profile_id,
        'Beco',
        'beco',
        'Sustainable personal care brand offering eco-friendly products like bamboo toothbrushes, biodegradable sanitary pads, and natural skincare products.',
        '/logos/beco.jpg',
        (SELECT id FROM categories WHERE name = 'Sustainable Products'),
        'Mumbai, Maharashtra',
        'https://beco.in',
        'https://wa.me/919876543222',
        'approved',
        'Sustainable choices for a better tomorrow',
        'Series A',
        '20-50',
        '2017-03-15',
        false,
        ARRAY['Product Development', 'Sustainability Partnerships'],
        'https://linkedin.com/company/beco',
        'https://instagram.com/beco',
        NULL,
        450,
        NOW(),
        NOW()
    ),
    -- Bambrew
    (
        founder_profile_id,
        'Bambrew',
        'bambrew',
        'Sustainable packaging solutions company offering bamboo-based alternatives to plastic packaging. We help businesses reduce their environmental footprint.',
        '/logos/bambrew.jpg',
        (SELECT id FROM categories WHERE name = 'Sustainable Products'),
        'Bangalore, Karnataka',
        'https://bambrew.com',
        'https://wa.me/919876543223',
        'approved',
        'Packaging that doesn''t cost the earth',
        'Series A',
        '50-100',
        '2018-01-20',
        false,
        ARRAY['B2B Partnerships', 'Technology Innovation'],
        'https://linkedin.com/company/bambrew',
        'https://instagram.com/bambrew',
        NULL,
        380,
        NOW(),
        NOW()
    ),
    -- ZeroCircle
    (
        founder_profile_id,
        'ZeroCircle',
        'zerocircle',
        'Climate tech startup focused on carbon capture and sustainable solutions. We help businesses achieve net-zero emissions through innovative technology.',
        '/logos/zerocircle.jpg',
        (SELECT id FROM categories WHERE name = 'Sustainable Products'),
        'Mumbai, Maharashtra',
        'https://zerocircle.com',
        'https://wa.me/919876543224',
        'approved',
        'Towards a zero-carbon future',
        'Seed',
        '10-20',
        '2020-06-01',
        false,
        ARRAY['Investment', 'Technology Partners', 'Pilot Projects'],
        'https://linkedin.com/company/zerocircle',
        'https://instagram.com/zerocircle',
        NULL,
        290,
        NOW(),
        NOW()
    );
    
    RAISE NOTICE 'Successfully inserted 15 startups with founder profile ID: %', founder_profile_id;
END $$;

-- Verify the insertions
SELECT 
    'Startups inserted successfully! 🎉' as message,
    COUNT(*) as total_startups
FROM startups;

-- Show sample of inserted data
SELECT 
    name, 
    slug, 
    logo_url, 
    status,
    is_featured,
    view_count
FROM startups 
ORDER BY created_at DESC
LIMIT 5;

-- Show the founder profile that was created
SELECT 
    'Founder profile created:' as message,
    id,
    full_name,
    role,
    user_id
FROM profiles 
WHERE role = 'founder';
