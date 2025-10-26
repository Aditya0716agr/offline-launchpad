// Sitemap generation utilities for SEO

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (entries: SitemapEntry[]): string => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

export const generateRobotsTxt = (sitemapUrl: string, disallowPaths: string[] = []): string => {
  const robots = `User-agent: *
Allow: /
${disallowPaths.map(path => `Disallow: ${path}`).join('\n')}

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Sitemap
Sitemap: ${sitemapUrl}

# Additional sitemaps
Sitemap: ${sitemapUrl.replace('.xml', '-images.xml')}
Sitemap: ${sitemapUrl.replace('.xml', '-news.xml')}`;

  return robots;
};

// Static pages for sitemap
export const getStaticPages = (): SitemapEntry[] => [
  {
    url: 'https://knowfounders.com',
    changefreq: 'daily',
    priority: 1.0
  },
  {
    url: 'https://knowfounders.com/home',
    changefreq: 'weekly',
    priority: 0.9
  },
  {
    url: 'https://knowfounders.com/explore',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: 'https://knowfounders.com/about',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    url: 'https://knowfounders.com/contact',
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    url: 'https://knowfounders.com/blog',
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    url: 'https://knowfounders.com/login',
    changefreq: 'monthly',
    priority: 0.3
  },
  {
    url: 'https://knowfounders.com/signup',
    changefreq: 'monthly',
    priority: 0.5
  },
  {
    url: 'https://knowfounders.com/privacy-policy',
    changefreq: 'yearly',
    priority: 0.3
  },
  {
    url: 'https://knowfounders.com/terms-of-service',
    changefreq: 'yearly',
    priority: 0.3
  }
];

// Category pages for sitemap
export const getCategoryPages = (categories: any[]): SitemapEntry[] => {
  return categories.map(category => ({
    url: `https://knowfounders.com/explore/${category.slug}`,
    changefreq: 'weekly',
    priority: 0.8
  }));
};

// Startup pages for sitemap
export const getStartupPages = (startups: any[]): SitemapEntry[] => {
  return startups.map(startup => ({
    url: `https://knowfounders.com/startups/${startup.slug || startup.id}`,
    lastmod: startup.updated_at || startup.created_at,
    changefreq: 'weekly',
    priority: 0.7
  }));
};

// Blog pages for sitemap
export const getBlogPages = (posts: any[]): SitemapEntry[] => {
  return posts.map(post => ({
    url: `https://knowfounders.com/blog/${post.slug || post.id}`,
    lastmod: post.updated_at || post.created_at,
    changefreq: 'monthly',
    priority: 0.6
  }));
};

// Enhanced sitemap generation functions
export const generateImageSitemap = (images: Array<{url: string, caption?: string, title?: string}>): string => {
  const imageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.google.com/schemas/sitemap-image/1.1">
${images.map(image => `  <url>
    <image:image>
      <image:loc>${image.url}</image:loc>
      ${image.caption ? `<image:caption>${image.caption}</image:caption>` : ''}
      ${image.title ? `<image:title>${image.title}</image:title>` : ''}
    </image:image>
  </url>`).join('\n')}
</urlset>`;

  return imageSitemap;
};

export const generateNewsSitemap = (articles: Array<{url: string, title: string, published: string, keywords?: string}>): string => {
  const newsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.google.com/schemas/sitemap-news/0.9">
${articles.map(article => `  <url>
    <news:news>
      <news:publication>
        <news:name>Know Founders</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${article.published}</news:publication_date>
      <news:title>${article.title}</news:title>
      ${article.keywords ? `<news:keywords>${article.keywords}</news:keywords>` : ''}
    </news:news>
  </url>`).join('\n')}
</urlset>`;

  return newsSitemap;
};

export const generateSitemapIndex = (sitemaps: Array<{url: string, lastmod?: string}>): string => {
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${sitemap.url}</loc>
    ${sitemap.lastmod ? `<lastmod>${sitemap.lastmod}</lastmod>` : ''}
  </sitemap>`).join('\n')}
</sitemapindex>`;

  return sitemapIndex;
};

// Category-specific sitemap entries
export const getCategorySitemapEntries = (categories: any[]): SitemapEntry[] => {
  return categories.map(category => ({
    url: `https://knowfounders.com/explore/${category.slug}`,
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: category.updated_at || new Date().toISOString()
  }));
};

// Location-specific sitemap entries
export const getLocationSitemapEntries = (locations: string[]): SitemapEntry[] => {
  return locations.map(location => ({
    url: `https://knowfounders.com/explore?location=${encodeURIComponent(location)}`,
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date().toISOString()
  }));
};

// Founder-specific sitemap entries
export const getFounderSitemapEntries = (founders: any[]): SitemapEntry[] => {
  return founders.map(founder => ({
    url: `https://knowfounders.com/founders/${founder.slug || founder.id}`,
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: founder.updated_at || founder.created_at
  }));
};

// Comprehensive sitemap generation
export const generateComprehensiveSitemap = (data: {
  startups: any[];
  categories: any[];
  blogPosts: any[];
  founders: any[];
  locations: string[];
}): string => {
  const entries: SitemapEntry[] = [
    ...getStaticPages(),
    ...getStartupPages(data.startups),
    ...getCategorySitemapEntries(data.categories),
    ...getBlogPages(data.blogPosts),
    ...getFounderSitemapEntries(data.founders),
    ...getLocationSitemapEntries(data.locations)
  ];

  return generateSitemap(entries);
};
