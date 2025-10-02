import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: any;
}

export const SEOHead = ({
  title = "Know Founders - Discover Non-Tech Startups & Entrepreneurs | Startup Directory",
  description = "Discover innovative non-tech startups and connect with entrepreneurs. Browse startup directory, find cofounders, get funding, and join the largest community of non-tech founders in India.",
  keywords = "non-tech startups, startup directory, find startups, startup discovery, non-tech founders, entrepreneur directory, startup community, business directory, startup listing, find cofounder, startup funding, business networking, startup ecosystem, entrepreneur platform, startup search, business discovery, startup database, founder network, startup marketplace, business opportunities, startup investment",
  image = "https://storage.googleapis.com/gpt-engineer-file-uploads/OVYktJbw3tZiZkzBsvSWWp5ISb23/social-images/social-1759048575325-Screenshot%202025-09-28%20140608.png",
  url = "https://knowfounders.com",
  type = "website",
  structuredData
}: SEOHeadProps) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

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

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@knowfounders" />
      <meta name="twitter:creator" content="@knowfounders" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
