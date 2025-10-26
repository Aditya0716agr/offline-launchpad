// Comprehensive SEO configuration
export const SEO_CONFIG = {
  site: {
    name: 'Know Founders',
    url: 'https://knowfounders.com',
    description: 'Discover innovative non-tech startups and connect with entrepreneurs. Browse startup directory, find cofounders, get funding, and join the largest community of non-tech founders in India.',
    logo: 'https://knowfounders.com/logo.png',
    twitter: '@knowfounders',
    facebook: 'https://facebook.com/knowfounders',
    linkedin: 'https://linkedin.com/company/knowfounders',
    instagram: 'https://instagram.com/knowfounders'
  },
  
  defaultMeta: {
    title: 'Know Founders - Discover Non-Tech Startups & Entrepreneurs | Startup Directory',
    description: 'Discover innovative non-tech startups and connect with entrepreneurs. Browse startup directory, find cofounders, get funding, and join the largest community of non-tech founders in India.',
    keywords: 'non-tech startups, startup directory, find startups, startup discovery, non-tech founders, entrepreneur directory, startup community, business directory, startup listing, find cofounder, startup funding, business networking, startup ecosystem, entrepreneur platform, startup search, business discovery, startup database, founder network, startup marketplace, business opportunities, startup investment',
    image: 'https://storage.googleapis.com/gpt-engineer-file-uploads/OVYktJbw3tZiZkzBsvSWWp5ISb23/social-images/social-1759048575325-Screenshot%202025-09-28%20140608.png',
    type: 'website',
    locale: 'en_US'
  },
  
  pages: {
    home: {
      title: 'Know Founders - Discover Non-Tech Startups & Entrepreneurs | Startup Directory',
      description: 'Discover innovative non-tech startups and connect with entrepreneurs. Browse startup directory, find cofounders, get funding, and join the largest community of non-tech founders in India.',
      keywords: 'non-tech startups, startup directory, find startups, startup discovery, non-tech founders, entrepreneur directory, startup community, business directory, startup listing, find cofounder, startup funding, business networking, startup ecosystem, entrepreneur platform, startup search, business discovery, startup database, founder network, startup marketplace, business opportunities, startup investment'
    },
    
    explore: {
      title: 'Discover Non-Tech Startups | Startup Directory | Know Founders',
      description: 'Browse and discover innovative non-tech startups across India. Find startups by category, location, and stage. Connect with founders, get funding, and join the startup ecosystem.',
      keywords: 'startup directory, discover startups, non-tech startups, startup search, find startups, startup discovery, business directory, entrepreneur directory, startup listing, startup database, startup marketplace, business opportunities, startup investment, founder network, startup community'
    },
    
    startup: {
      titleTemplate: '{startupName} - {tagline} | Know Founders',
      descriptionTemplate: '{description} | Discover more about {startupName} and connect with the founder on Know Founders.',
      keywordsTemplate: '{startupName}, {category}, {location}, non-tech startup, startup directory, entrepreneur, founder, business directory, startup discovery'
    },
    
    blog: {
      titleTemplate: '{title} | Know Founders Blog',
      descriptionTemplate: '{excerpt} | Read more startup insights and founder stories on Know Founders blog.',
      keywordsTemplate: '{tags}, startup blog, entrepreneur blog, non-tech startups, startup advice, business tips, founder insights, startup stories'
    },
    
    about: {
      title: 'About Know Founders - Non-Tech Startup Discovery Platform',
      description: 'Learn about Know Founders, the leading platform for discovering non-tech startups in India. Our mission is to connect entrepreneurs and help startups get discovered.',
      keywords: 'about know founders, startup platform, non-tech startups, entrepreneur platform, startup discovery platform, founder network'
    },
    
    contact: {
      title: 'Contact Know Founders - Get in Touch',
      description: 'Contact Know Founders for support, partnerships, or media inquiries. We\'re here to help startups and entrepreneurs succeed.',
      keywords: 'contact know founders, startup support, entrepreneur support, business partnerships, media inquiries'
    }
  },
  
  structuredData: {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Know Founders',
      alternateName: 'KnowFounders',
      url: 'https://knowfounders.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://knowfounders.com/logo.png',
        width: 200,
        height: 200
      },
      description: 'Discover innovative non-tech startups and connect with entrepreneurs. The largest community of non-tech founders in India.',
      foundingDate: '2024',
      founder: {
        '@type': 'Person',
        name: 'Know Founders Team'
      },
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN'
      },
      sameAs: [
        'https://twitter.com/knowfounders',
        'https://linkedin.com/company/knowfounders',
        'https://facebook.com/knowfounders',
        'https://instagram.com/knowfounders'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'hello@knowfounders.com',
        availableLanguage: 'English'
      },
      areaServed: {
        '@type': 'Country',
        name: 'India'
      },
      serviceType: 'Startup Discovery Platform'
    },
    
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Know Founders',
      alternateName: 'KnowFounders',
      url: 'https://knowfounders.com',
      description: 'Discover innovative non-tech startups and connect with entrepreneurs',
      inLanguage: 'en-US',
      isAccessibleForFree: true,
      publisher: {
        '@type': 'Organization',
        name: 'Know Founders',
        url: 'https://knowfounders.com'
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://knowfounders.com/explore?search={search_term_string}'
        },
        query-input: 'required name=search_term_string'
      },
      mainEntity: {
        '@type': 'ItemList',
        name: 'Non-Tech Startups Directory',
        description: 'Comprehensive directory of non-tech startups in India'
      }
    }
  },
  
  performance: {
    preload: [
      '/favicon.ico',
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
    ],
    dnsPrefetch: [
      '//fonts.googleapis.com',
      '//fonts.gstatic.com',
      '//storage.googleapis.com',
      '//www.google-analytics.com',
      '//www.googletagmanager.com'
    ],
    preconnect: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://storage.googleapis.com',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com'
    ]
  },
  
  robots: {
    disallow: [
      '/dashboard',
      '/admin',
      '/api/',
      '/_next/',
      '/static/',
      '/auth/',
      '/profile/',
      '/settings/',
      '/user/',
      '/private/',
      '/internal/',
      '/*?*utm_*',
      '/*?*ref=*',
      '/*?*source=*',
      '/*?*campaign=*'
    ],
    allow: [
      '/',
      '/explore',
      '/startups/',
      '/blog/',
      '/about',
      '/contact',
      '/privacy-policy',
      '/terms-of-service'
    ],
    crawlDelay: 1,
    sitemaps: [
      'https://knowfounders.com/sitemap.xml',
      'https://knowfounders.com/sitemap-images.xml',
      'https://knowfounders.com/sitemap-news.xml'
    ]
  }
};

// Helper functions for SEO
export const getPageTitle = (page: keyof typeof SEO_CONFIG.pages, data?: Record<string, string>): string => {
  const pageConfig = SEO_CONFIG.pages[page];
  
  if (pageConfig.titleTemplate && data) {
    return pageConfig.titleTemplate.replace(/\{(\w+)\}/g, (match, key) => data[key] || match);
  }
  
  return pageConfig.title || SEO_CONFIG.defaultMeta.title;
};

export const getPageDescription = (page: keyof typeof SEO_CONFIG.pages, data?: Record<string, string>): string => {
  const pageConfig = SEO_CONFIG.pages[page];
  
  if (pageConfig.descriptionTemplate && data) {
    return pageConfig.descriptionTemplate.replace(/\{(\w+)\}/g, (match, key) => data[key] || match);
  }
  
  return pageConfig.description || SEO_CONFIG.defaultMeta.description;
};

export const getPageKeywords = (page: keyof typeof SEO_CONFIG.pages, data?: Record<string, string>): string => {
  const pageConfig = SEO_CONFIG.pages[page];
  
  if (pageConfig.keywordsTemplate && data) {
    return pageConfig.keywordsTemplate.replace(/\{(\w+)\}/g, (match, key) => data[key] || match);
  }
  
  return pageConfig.keywords || SEO_CONFIG.defaultMeta.keywords;
};
