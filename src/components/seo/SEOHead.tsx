import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: any;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  alternateLocales?: string[];
  noindex?: boolean;
  nofollow?: boolean;
}

export const SEOHead = ({
  title = "Know Founders - Discover Non-Tech Startups & Entrepreneurs | Startup Directory",
  description = "Discover innovative non-tech startups and connect with entrepreneurs. Browse startup directory, find cofounders, get funding, and join the largest community of non-tech founders in India.",
  keywords = "non-tech startups, startup directory, find startups, startup discovery, non-tech founders, entrepreneur directory, startup community, business directory, startup listing, find cofounder, startup funding, business networking, startup ecosystem, entrepreneur platform, startup search, business discovery, startup database, founder network, startup marketplace, business opportunities, startup investment",
  image = "https://storage.googleapis.com/gpt-engineer-file-uploads/OVYktJbw3tZiZkzBsvSWWp5ISb23/social-images/social-1759048575325-Screenshot%202025-09-28%20140608.png",
  url = "https://knowfounders.com",
  type = "website",
  structuredData,
  author = "Know Founders Team",
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  locale = "en_US",
  alternateLocales = [],
  noindex = false,
  nofollow = false
}: SEOHeadProps) => {
  const robotsContent = `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robotsContent} />
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />
      
      {/* Language and Locale */}
      <html lang="en" />
      <meta property="og:locale" content={locale} />
      {alternateLocales.map(locale => (
        <meta key={locale} property="og:locale:alternate" content={locale} />
      ))}

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Know Founders" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@knowfounders" />
      <meta name="twitter:creator" content="@knowfounders" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#059669" />
      <meta name="msapplication-TileColor" content="#059669" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      
      {/* Performance Hints */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//storage.googleapis.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://storage.googleapis.com" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
