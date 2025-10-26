// Crawler detection and optimization utilities
export const CRAWLER_USER_AGENTS = [
  // Google
  'Googlebot',
  'Googlebot-Image',
  'Googlebot-News',
  'Googlebot-Video',
  'Google-InspectionTool',
  
  // Bing
  'Bingbot',
  'bingbot',
  'msnbot',
  
  // Yahoo
  'Slurp',
  'Yahoo! Slurp',
  
  // DuckDuckGo
  'DuckDuckBot',
  'DuckDuckGo-Favicons-Bot',
  
  // Baidu
  'Baiduspider',
  'Baiduspider-Image',
  
  // Yandex
  'YandexBot',
  'YandexImages',
  'YandexVideo',
  
  // Facebook
  'facebookexternalhit',
  'facebookcatalog',
  
  // Twitter
  'Twitterbot',
  
  // LinkedIn
  'LinkedInBot',
  
  // Pinterest
  'Pinterestbot',
  
  // WhatsApp
  'WhatsApp',
  
  // Telegram
  'TelegramBot',
  
  // Apple
  'Applebot',
  
  // Other crawlers
  'ia_archiver',
  'archive.org_bot',
  'Wayback',
  'SemrushBot',
  'AhrefsBot',
  'MJ12bot',
  'DotBot',
  'SeoCheckBot',
  'BLEXBot',
  'SeobilityBot',
  'SiteAuditBot',
  'SitebulbBot',
  'Screaming Frog SEO Spider',
  'MegaIndex',
  'DataForSeoBot',
  'AspiegelBot',
  'Bytespider',
  'CCBot',
  'ChatGPT-User',
  'Claude-Web',
  'GPTBot',
  'Google-Extended',
  'PerplexityBot',
  'YouBot',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'cohere-ai',
  'PerplexityBot',
  'YouBot'
];

export const SOCIAL_CRAWLERS = [
  'facebookexternalhit',
  'facebookcatalog',
  'Twitterbot',
  'LinkedInBot',
  'Pinterestbot',
  'WhatsApp',
  'TelegramBot',
  'SkypeUriPreview',
  'Slackbot',
  'Discordbot',
  'ViberBot',
  'LineBot'
];

export const AI_CRAWLERS = [
  'ChatGPT-User',
  'Claude-Web',
  'GPTBot',
  'Google-Extended',
  'PerplexityBot',
  'YouBot',
  'ClaudeBot',
  'anthropic-ai',
  'cohere-ai',
  'CCBot',
  'Bytespider',
  'AspiegelBot'
];

// Detect if the request is from a crawler
export const isCrawler = (userAgent: string): boolean => {
  if (!userAgent) return false;
  
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(crawler => 
    ua.includes(crawler.toLowerCase())
  );
};

// Detect if the request is from a social media crawler
export const isSocialCrawler = (userAgent: string): boolean => {
  if (!userAgent) return false;
  
  const ua = userAgent.toLowerCase();
  return SOCIAL_CRAWLERS.some(crawler => 
    ua.includes(crawler.toLowerCase())
  );
};

// Detect if the request is from an AI crawler
export const isAICrawler = (userAgent: string): boolean => {
  if (!userAgent) return false;
  
  const ua = userAgent.toLowerCase();
  return AI_CRAWLERS.some(crawler => 
    ua.includes(crawler.toLowerCase())
  );
};

// Get crawler type for specific optimization
export const getCrawlerType = (userAgent: string): 'search' | 'social' | 'ai' | 'other' | 'none' => {
  if (isAICrawler(userAgent)) return 'ai';
  if (isSocialCrawler(userAgent)) return 'social';
  if (isCrawler(userAgent)) return 'search';
  return 'none';
};

// Check if crawler supports JavaScript
export const supportsJavaScript = (userAgent: string): boolean => {
  const modernCrawlers = [
    'Googlebot',
    'Bingbot',
    'Slurp',
    'DuckDuckBot',
    'Baiduspider',
    'YandexBot',
    'Applebot'
  ];
  
  const ua = userAgent.toLowerCase();
  return modernCrawlers.some(crawler => 
    ua.includes(crawler.toLowerCase())
  );
};

// Get crawler-specific optimization settings
export const getCrawlerOptimization = (userAgent: string) => {
  const crawlerType = getCrawlerType(userAgent);
  
  return {
    enableJavaScript: supportsJavaScript(userAgent),
    enableImages: true,
    enableCSS: true,
    enableFonts: true,
    enableAnalytics: false,
    enableAds: false,
    enableSocialSharing: crawlerType === 'social',
    enableStructuredData: true,
    enableMetaTags: true,
    enableSitemap: true,
    enableRobots: true,
    timeout: crawlerType === 'ai' ? 30000 : 10000, // AI crawlers may need more time
    maxRetries: crawlerType === 'ai' ? 3 : 1
  };
};

// Generate crawler-specific meta tags
export const getCrawlerMetaTags = (userAgent: string) => {
  const crawlerType = getCrawlerType(userAgent);
  const optimization = getCrawlerOptimization(userAgent);
  
  const metaTags = {
    'crawler-type': crawlerType,
    'supports-javascript': optimization.enableJavaScript.toString(),
    'supports-images': optimization.enableImages.toString(),
    'supports-css': optimization.enableCSS.toString(),
    'supports-fonts': optimization.enableFonts.toString(),
    'analytics-enabled': optimization.enableAnalytics.toString(),
    'ads-enabled': optimization.enableAds.toString(),
    'social-sharing-enabled': optimization.enableSocialSharing.toString(),
    'structured-data-enabled': optimization.enableStructuredData.toString(),
    'meta-tags-enabled': optimization.enableMetaTags.toString(),
    'sitemap-enabled': optimization.enableSitemap.toString(),
    'robots-enabled': optimization.enableRobots.toString()
  };
  
  return metaTags;
};

// Check if request is from a known good crawler
export const isKnownGoodCrawler = (userAgent: string): boolean => {
  const goodCrawlers = [
    'Googlebot',
    'Bingbot',
    'Slurp',
    'DuckDuckBot',
    'Baiduspider',
    'YandexBot',
    'Applebot',
    'facebookexternalhit',
    'Twitterbot',
    'LinkedInBot',
    'Pinterestbot'
  ];
  
  const ua = userAgent.toLowerCase();
  return goodCrawlers.some(crawler => 
    ua.includes(crawler.toLowerCase())
  );
};

// Get crawler-specific content strategy
export const getCrawlerContentStrategy = (userAgent: string) => {
  const crawlerType = getCrawlerType(userAgent);
  
  switch (crawlerType) {
    case 'search':
      return {
        prioritizeText: true,
        prioritizeImages: true,
        prioritizeStructuredData: true,
        prioritizeMetaTags: true,
        prioritizeSitemap: true,
        prioritizeRobots: true,
        contentDepth: 'full'
      };
    
    case 'social':
      return {
        prioritizeImages: true,
        prioritizeMetaTags: true,
        prioritizeOpenGraph: true,
        prioritizeTwitterCards: true,
        prioritizeText: false,
        prioritizeStructuredData: false,
        contentDepth: 'summary'
      };
    
    case 'ai':
      return {
        prioritizeText: true,
        prioritizeStructuredData: true,
        prioritizeMetaTags: true,
        prioritizeImages: false,
        prioritizeSitemap: true,
        prioritizeRobots: true,
        contentDepth: 'full'
      };
    
    default:
      return {
        prioritizeText: true,
        prioritizeImages: true,
        prioritizeStructuredData: true,
        prioritizeMetaTags: true,
        prioritizeSitemap: true,
        prioritizeRobots: true,
        contentDepth: 'full'
      };
  }
};
