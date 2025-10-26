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
  breadcrumbs?: Array<{name: string, url: string}>;
  faq?: Array<{question: string, answer: string}>;
  price?: string;
  priceCurrency?: string;
  availability?: string;
  brand?: string;
  sku?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  lastReviewed?: string;
  expires?: string;
  geo?: {
    latitude?: number;
    longitude?: number;
    placename?: string;
    region?: string;
  };
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
  nofollow = false,
  breadcrumbs,
  faq,
  price,
  priceCurrency,
  availability,
  brand,
  sku,
  category,
  rating,
  reviewCount,
  lastReviewed,
  expires,
  geo
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
      <meta name="generator" content="React" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Know Founders" />
      <meta name="application-name" content="Know Founders" />
      <meta name="msapplication-tooltip" content="Discover Non-Tech Startups" />
      <meta name="msapplication-starturl" content="/" />
      <meta name="msapplication-navbutton-color" content="#059669" />
      <meta name="msapplication-TileColor" content="#059669" />
      <meta name="msapplication-TileImage" content="/favicon.ico" />
      <meta name="theme-color" content="#059669" />
      <meta name="theme-color" content="#059669" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#059669" media="(prefers-color-scheme: dark)" />
      
      {/* Canonical URL */}
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
      <meta property="og:image:type" content="image/png" />
      <meta property="og:site_name" content="Know Founders" />
      <meta property="og:updated_time" content={modifiedTime || new Date().toISOString()} />
      
      {/* Article specific meta tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {author && <meta property="article:author" content={author} />}
      {tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Product specific meta tags */}
      {price && <meta property="product:price:amount" content={price} />}
      {priceCurrency && <meta property="product:price:currency" content={priceCurrency} />}
      {availability && <meta property="product:availability" content={availability} />}
      {brand && <meta property="product:brand" content={brand} />}
      {sku && <meta property="product:sku" content={sku} />}
      {category && <meta property="product:category" content={category} />}
      
      {/* Rating and Reviews */}
      {rating && <meta property="og:rating" content={rating.toString()} />}
      {reviewCount && <meta property="og:rating_count" content={reviewCount.toString()} />}
      
      {/* Geographic location */}
      {geo?.latitude && <meta property="og:latitude" content={geo.latitude.toString()} />}
      {geo?.longitude && <meta property="og:longitude" content={geo.longitude.toString()} />}
      {geo?.placename && <meta property="og:placename" content={geo.placename} />}
      {geo?.region && <meta property="og:region" content={geo.region} />}

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@knowfounders" />
      <meta name="twitter:creator" content="@knowfounders" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:domain" content="knowfounders.com" />
      <meta name="twitter:url" content={url} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      <meta name="referrer" content="origin-when-cross-origin" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="revisit-after" content="1 days" />
      <meta name="expires" content={expires} />
      <meta name="last-modified" content={lastReviewed || new Date().toISOString()} />
      
      {/* Performance Hints */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//storage.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://storage.googleapis.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      
      {/* Preload critical resources */}
      <link rel="preload" href="/favicon.ico" as="image" type="image/x-icon" />
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Breadcrumb Structured Data */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": item.name,
              "item": item.url
            }))
          })}
        </script>
      )}
      
      {/* FAQ Structured Data */}
      {faq && faq.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faq.map(item => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
              }
            }))
          })}
        </script>
      )}
    </Helmet>
  );
};
