// Sitemap generation utilities for SEO

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (entries: SitemapEntry[]): string => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
${disallowPaths.map(path => `Disallow: ${path}`).join('\n')}

Sitemap: ${sitemapUrl}`;

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
    url: `https://knowfounders.com/startup/${startup.slug || startup.id}`,
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
