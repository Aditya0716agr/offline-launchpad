// Static HTML fallbacks for crawlers
export const generateStaticHTML = (pageData: {
  title: string;
  description: string;
  content: string;
  structuredData?: any;
  metaTags?: Record<string, string>;
  canonicalUrl?: string;
  image?: string;
}) => {
  const {
    title,
    description,
    content,
    structuredData,
    metaTags = {},
    canonicalUrl = 'https://knowfounders.com',
    image = 'https://storage.googleapis.com/gpt-engineer-file-uploads/OVYktJbw3tZiZkzBsvSWWp5ISb23/social-images/social-1759048575325-Screenshot%202025-09-28%20140608.png'
  } = pageData;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index, follow">
  <meta name="generator" content="Know Founders Static Generator">
  
  <!-- Basic Meta Tags -->
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Additional Meta Tags -->
  ${Object.entries(metaTags).map(([key, value]) => 
    `<meta name="${key}" content="${value}">`
  ).join('\n  ')}
  
  <!-- Open Graph Meta Tags -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${title}">
  <meta property="og:site_name" content="Know Founders">
  
  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@knowfounders">
  <meta name="twitter:creator" content="@knowfounders">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:image:alt" content="${title}">
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  
  <!-- Structured Data -->
  ${structuredData ? `
  <script type="application/ld+json">
    ${JSON.stringify(structuredData, null, 2)}
  </script>
  ` : ''}
  
  <!-- Basic CSS for crawler rendering -->
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      background-color: #f8fafc;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    h1 {
      color: #1e293b;
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    h2 {
      color: #334155;
      font-size: 1.8rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
    h3 {
      color: #475569;
      font-size: 1.4rem;
      margin-top: 1.5rem;
      margin-bottom: 0.8rem;
    }
    p {
      color: #64748b;
      margin-bottom: 1rem;
    }
    .startup-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      background: #f8fafc;
    }
    .startup-name {
      font-size: 1.2rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 8px;
    }
    .startup-description {
      color: #64748b;
      margin-bottom: 12px;
    }
    .startup-meta {
      font-size: 0.9rem;
      color: #94a3b8;
    }
    .loading {
      text-align: center;
      padding: 40px;
      color: #64748b;
    }
    .error {
      color: #dc2626;
      background: #fef2f2;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #fecaca;
    }
  </style>
</head>
<body>
  <div class="container">
    ${content}
  </div>
  
  <!-- Fallback JavaScript for enhanced functionality -->
  <script>
    // Basic JavaScript for crawler compatibility
    document.addEventListener('DOMContentLoaded', function() {
      // Add any essential JavaScript here
      console.log('Static HTML loaded for crawler');
    });
  </script>
</body>
</html>`;
};

// Generate static HTML for homepage
export const generateHomepageStaticHTML = () => {
  return generateStaticHTML({
    title: 'Know Founders - Discover Non-Tech Startups & Entrepreneurs | Startup Directory',
    description: 'Discover innovative non-tech startups and connect with entrepreneurs. Browse startup directory, find cofounders, get funding, and join the largest community of non-tech founders in India.',
    content: `
      <h1>Know Founders - Discover Non-Tech Startups</h1>
      <p>The discovery platform where real-world products get the spotlight they deserve. Launch your food brand, wellness product, retail business, or service—get upvotes, feedback, and discovered by customers.</p>
      
      <h2>Featured Startups</h2>
      <div class="startup-card">
        <div class="startup-name">Sample Startup 1</div>
        <div class="startup-description">Innovative food and beverage startup revolutionizing the industry with sustainable practices.</div>
        <div class="startup-meta">Location: Mumbai, India | Stage: Launched | Category: Food & Beverage</div>
      </div>
      
      <div class="startup-card">
        <div class="startup-name">Sample Startup 2</div>
        <div class="startup-description">Health and wellness platform connecting users with certified wellness professionals.</div>
        <div class="startup-meta">Location: Bangalore, India | Stage: Scaling | Category: Wellness & Health</div>
      </div>
      
      <div class="startup-card">
        <div class="startup-name">Sample Startup 3</div>
        <div class="startup-description">Sustainable fashion brand creating eco-friendly clothing for conscious consumers.</div>
        <div class="startup-meta">Location: Delhi, India | Stage: MVP | Category: Retail & Fashion</div>
      </div>
      
      <h2>How It Works</h2>
      <h3>1. Showcase Your Startup</h3>
      <p>Create a compelling profile for your non-tech business and get discovered by the community.</p>
      
      <h3>2. Connect & Validate</h3>
      <p>Get feedback from fellow founders, find potential cofounders, and validate your business ideas.</p>
      
      <h3>3. Launch & Scale</h3>
      <p>Access investors, build partnerships, and accelerate your growth with our founder network.</p>
      
      <h2>Categories</h2>
      <p>Food & Beverage | Wellness & Health | Retail & Fashion | Services | Beauty & Personal Care | Fitness & Sports | Home & Living | Education & Training | Entertainment | Travel & Hospitality | Professional Services | Sustainability</p>
      
      <h2>Join the Community</h2>
      <p>Trusted by 1000+ founders. Reach 10,000+ Entrepreneurs. Join the largest community of non-tech founders in India.</p>
    `,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Know Founders",
      "alternateName": "KnowFounders",
      "url": "https://knowfounders.com",
      "description": "Discover innovative non-tech startups and connect with entrepreneurs. The largest community of non-tech founders in India.",
      "foundingDate": "2024",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      },
      "sameAs": [
        "https://twitter.com/knowfounders",
        "https://linkedin.com/company/knowfounders",
        "https://facebook.com/knowfounders",
        "https://instagram.com/knowfounders"
      ]
    }
  });
};

// Generate static HTML for startup page
export const generateStartupStaticHTML = (startup: any) => {
  return generateStaticHTML({
    title: `${startup.name} - ${startup.tagline || startup.description.substring(0, 50)}... | Know Founders`,
    description: startup.description.length > 160 
      ? startup.description.substring(0, 157) + '...'
      : startup.description,
    content: `
      <h1>${startup.name}</h1>
      ${startup.tagline ? `<p><strong>${startup.tagline}</strong></p>` : ''}
      
      <h2>About</h2>
      <p>${startup.description}</p>
      
      <h2>Details</h2>
      <p><strong>Category:</strong> ${startup.categories?.name || 'Not specified'}</p>
      <p><strong>Location:</strong> ${startup.location || 'Not specified'}</p>
      <p><strong>Stage:</strong> ${startup.stage || 'Not specified'}</p>
      <p><strong>Team Size:</strong> ${startup.team_size || 'Not specified'}</p>
      ${startup.launch_date ? `<p><strong>Launch Date:</strong> ${new Date(startup.launch_date).toLocaleDateString()}</p>` : ''}
      
      ${startup.website_url ? `
      <h2>Website</h2>
      <p><a href="${startup.website_url}" target="_blank" rel="noopener">Visit Website</a></p>
      ` : ''}
      
      ${startup.looking_for && startup.looking_for.length > 0 ? `
      <h2>Looking For</h2>
      <ul>
        ${startup.looking_for.map((item: string) => `<li>${item}</li>`).join('')}
      </ul>
      ` : ''}
      
      <h2>Contact</h2>
      ${startup.email_contact ? `<p><strong>Email:</strong> ${startup.email_contact}</p>` : ''}
      ${startup.phone_number ? `<p><strong>Phone:</strong> ${startup.phone_number}</p>` : ''}
      
      <h2>Social Media</h2>
      ${startup.social_instagram ? `<p><strong>Instagram:</strong> <a href="${startup.social_instagram}" target="_blank" rel="noopener">Follow on Instagram</a></p>` : ''}
      ${startup.social_facebook ? `<p><strong>Facebook:</strong> <a href="${startup.social_facebook}" target="_blank" rel="noopener">Follow on Facebook</a></p>` : ''}
      ${startup.social_linkedin ? `<p><strong>LinkedIn:</strong> <a href="${startup.social_linkedin}" target="_blank" rel="noopener">Connect on LinkedIn</a></p>` : ''}
      ${startup.social_twitter ? `<p><strong>Twitter:</strong> <a href="${startup.social_twitter}" target="_blank" rel="noopener">Follow on Twitter</a></p>` : ''}
    `,
    canonicalUrl: `https://knowfounders.com/startups/${startup.slug || startup.id}`,
    image: startup.cover_image_url || startup.logo_url,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": startup.name,
      "description": startup.description,
      "url": startup.website_url || `https://knowfounders.com/startups/${startup.slug || startup.id}`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": startup.city,
        "addressRegion": startup.state_region,
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "email": startup.email_contact,
        "telephone": startup.phone_number
      }
    }
  });
};

// Generate static HTML for explore page
export const generateExploreStaticHTML = (startups: any[], categories: any[]) => {
  return generateStaticHTML({
    title: 'Discover Non-Tech Startups | Startup Directory | Know Founders',
    description: 'Browse and discover innovative non-tech startups across India. Find startups by category, location, and stage. Connect with founders, get funding, and join the startup ecosystem.',
    content: `
      <h1>Discover Non-Tech Startups</h1>
      <p>Browse and discover innovative non-tech startups across India. Find startups by category, location, and stage. Connect with founders, get funding, and join the startup ecosystem.</p>
      
      <h2>Categories</h2>
      <p>${categories.map((cat: any) => cat.name).join(' | ')}</p>
      
      <h2>Featured Startups</h2>
      ${startups.slice(0, 10).map((startup: any) => `
        <div class="startup-card">
          <div class="startup-name">${startup.name}</div>
          <div class="startup-description">${startup.description}</div>
          <div class="startup-meta">Location: ${startup.location || 'Not specified'} | Category: ${startup.categories?.name || 'Not specified'} | Stage: ${startup.stage || 'Not specified'}</div>
        </div>
      `).join('')}
      
      <h2>How to Find Startups</h2>
      <h3>Browse by Category</h3>
      <p>Explore startups by industry categories like Food & Beverage, Wellness & Health, Retail & Fashion, and more.</p>
      
      <h3>Search by Location</h3>
      <p>Find startups in your city or region across India.</p>
      
      <h3>Filter by Stage</h3>
      <p>Discover startups at different stages from Idea to Scaling.</p>
      
      <h2>Join the Community</h2>
      <p>Connect with founders, get feedback on your ideas, find cofounders, and access funding opportunities.</p>
    `,
    canonicalUrl: 'https://knowfounders.com/explore'
  });
};

// Generate static HTML for blog post
export const generateBlogStaticHTML = (post: any) => {
  return generateStaticHTML({
    title: `${post.title} | Know Founders Blog`,
    description: post.excerpt || post.content.substring(0, 160) + '...',
    content: `
      <h1>${post.title}</h1>
      <p><strong>By:</strong> ${post.author} | <strong>Published:</strong> ${new Date(post.published_at).toLocaleDateString()}</p>
      ${post.read_time ? `<p><strong>Read Time:</strong> ${post.read_time} minutes</p>` : ''}
      
      <div style="margin-top: 2rem;">
        ${post.content.replace(/\n/g, '<br>')}
      </div>
      
      <h2>About the Author</h2>
      <p>${post.author} is a contributor to the Know Founders blog, sharing insights about non-tech startups and entrepreneurship.</p>
      
      <h2>Related Topics</h2>
      <p>${post.tags ? post.tags.join(' | ') : 'Startup advice, Entrepreneurship, Non-tech startups'}</p>
    `,
    canonicalUrl: `https://knowfounders.com/blog/${post.slug}`,
    image: post.featured_image,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.excerpt || post.content.substring(0, 160),
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "Know Founders",
        "logo": {
          "@type": "ImageObject",
          "url": "https://knowfounders.com/logo.png"
        }
      },
      "datePublished": post.published_at,
      "dateModified": post.updated_at
    }
  });
};
