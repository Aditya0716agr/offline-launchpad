import React from 'react';
import { Helmet } from 'react-helmet-async';
import { isCrawler, getCrawlerType, getCrawlerOptimization, getCrawlerMetaTags } from '@/lib/crawler-detection';

interface CrawlerOptimizedSEOProps {
  userAgent?: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  structuredData?: any;
  enableJavaScript?: boolean;
  enableImages?: boolean;
  enableCSS?: boolean;
  enableFonts?: boolean;
  enableAnalytics?: boolean;
  enableAds?: boolean;
}

export const CrawlerOptimizedSEO = ({
  userAgent = '',
  children,
  title = 'Know Founders - Discover Non-Tech Startups & Entrepreneurs | Startup Directory',
  description = 'Discover innovative non-tech startups and connect with entrepreneurs. Browse startup directory, find cofounders, get funding, and join the largest community of non-tech founders in India.',
  image = 'https://storage.googleapis.com/gpt-engineer-file-uploads/OVYktJbw3tZiZkzBsvSWWp5ISb23/social-images/social-1759048575325-Screenshot%202025-09-28%20140608.png',
  url = 'https://knowfounders.com',
  structuredData,
  enableJavaScript = true,
  enableImages = true,
  enableCSS = true,
  enableFonts = true,
  enableAnalytics = true,
  enableAds = true
}: CrawlerOptimizedSEOProps) => {
  const isCrawlerRequest = isCrawler(userAgent);
  const crawlerType = getCrawlerType(userAgent);
  const optimization = getCrawlerOptimization(userAgent);
  const crawlerMetaTags = getCrawlerMetaTags(userAgent);

  // Override settings based on crawler detection
  const finalSettings = {
    enableJavaScript: isCrawlerRequest ? optimization.enableJavaScript : enableJavaScript,
    enableImages: isCrawlerRequest ? optimization.enableImages : enableImages,
    enableCSS: isCrawlerRequest ? optimization.enableCSS : enableCSS,
    enableFonts: isCrawlerRequest ? optimization.enableFonts : enableFonts,
    enableAnalytics: isCrawlerRequest ? optimization.enableAnalytics : enableAnalytics,
    enableAds: isCrawlerRequest ? optimization.enableAds : enableAds
  };

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags - Always include for crawlers */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={url} />
        
        {/* Crawler-specific meta tags */}
        {isCrawlerRequest && (
          <>
            <meta name="crawler-type" content={crawlerType} />
            <meta name="supports-javascript" content={finalSettings.enableJavaScript.toString()} />
            <meta name="supports-images" content={finalSettings.enableImages.toString()} />
            <meta name="supports-css" content={finalSettings.enableCSS.toString()} />
            <meta name="supports-fonts" content={finalSettings.enableFonts.toString()} />
            <meta name="analytics-enabled" content={finalSettings.enableAnalytics.toString()} />
            <meta name="ads-enabled" content={finalSettings.enableAds.toString()} />
            <meta name="social-sharing-enabled" content={optimization.enableSocialSharing.toString()} />
            <meta name="structured-data-enabled" content={optimization.enableStructuredData.toString()} />
            <meta name="meta-tags-enabled" content={optimization.enableMetaTags.toString()} />
            <meta name="sitemap-enabled" content={optimization.enableSitemap.toString()} />
            <meta name="robots-enabled" content={optimization.enableRobots.toString()} />
          </>
        )}

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={title} />
        <meta property="og:site_name" content="Know Founders" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@knowfounders" />
        <meta name="twitter:creator" content="@knowfounders" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:image:alt" content={title} />

        {/* Performance Hints - Only for non-crawlers */}
        {!isCrawlerRequest && (
          <>
            <link rel="dns-prefetch" href="//fonts.googleapis.com" />
            <link rel="dns-prefetch" href="//fonts.gstatic.com" />
            <link rel="dns-prefetch" href="//storage.googleapis.com" />
            <link rel="dns-prefetch" href="//www.google-analytics.com" />
            <link rel="dns-prefetch" href="//www.googletagmanager.com" />
            <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link rel="preconnect" href="https://storage.googleapis.com" crossorigin />
            <link rel="preconnect" href="https://www.google-analytics.com" crossorigin />
            <link rel="preconnect" href="https://www.googletagmanager.com" crossorigin />
            <link rel="preload" href="/favicon.ico" as="image" type="image/x-icon" />
            <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" as="style" />
          </>
        )}

        {/* Favicon and App Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Structured Data - Always include for crawlers */}
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}

        {/* Analytics - Only for non-crawlers */}
        {!isCrawlerRequest && finalSettings.enableAnalytics && (
          <>
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-99L81PFHRL"></script>
            <script>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-99L81PFHRL', {
                  page_title: 'KnowFounders',
                  page_location: 'https://knowfounder.online/'
                });
              `}
            </script>
          </>
        )}

        {/* AdSense - Only for non-crawlers */}
        {!isCrawlerRequest && finalSettings.enableAds && (
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9614136099969759" crossOrigin="anonymous"></script>
        )}

        {/* Meta Pixel - Only for non-crawlers */}
        {!isCrawlerRequest && (
          <script>
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'YOUR_PIXEL_ID');
              fbq('track', 'PageView');
            `}
          </script>
        )}
      </Helmet>

      {/* Render children with crawler-specific optimizations */}
      <div 
        className={`crawler-optimized ${isCrawlerRequest ? 'crawler-mode' : 'user-mode'}`}
        data-crawler-type={crawlerType}
        data-supports-javascript={finalSettings.enableJavaScript}
        data-supports-images={finalSettings.enableImages}
        data-supports-css={finalSettings.enableCSS}
        data-supports-fonts={finalSettings.enableFonts}
        data-analytics-enabled={finalSettings.enableAnalytics}
        data-ads-enabled={finalSettings.enableAds}
      >
        {children}
      </div>

      {/* Meta Pixel noscript fallback - Only for non-crawlers */}
      {!isCrawlerRequest && (
        <noscript>
          <img height="1" width="1" style={{display: 'none'}}
            src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
          />
        </noscript>
      )}
    </>
  );
};

// Hook for crawler detection in components
export const useCrawlerDetection = () => {
  const [isCrawlerRequest, setIsCrawlerRequest] = React.useState(false);
  const [crawlerType, setCrawlerType] = React.useState<string>('none');
  const [optimization, setOptimization] = React.useState<any>(null);

  React.useEffect(() => {
    const userAgent = navigator.userAgent;
    const isCrawlerReq = isCrawler(userAgent);
    const crawlerTypeValue = getCrawlerType(userAgent);
    const optimizationValue = getCrawlerOptimization(userAgent);

    setIsCrawlerRequest(isCrawlerReq);
    setCrawlerType(crawlerTypeValue);
    setOptimization(optimizationValue);
  }, []);

  return {
    isCrawlerRequest,
    crawlerType,
    optimization
  };
};
