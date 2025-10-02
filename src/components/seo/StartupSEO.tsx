import { SEOHead } from './SEOHead';

interface Startup {
  id: string;
  name: string;
  description: string;
  tagline?: string;
  logo_url?: string;
  cover_image_url?: string;
  city?: string;
  state_region?: string;
  category?: {
    name: string;
  };
  website_url?: string;
  stage?: string;
  team_size?: string;
  founded_date?: string;
}

interface StartupSEOProps {
  startup: Startup;
  baseUrl?: string;
}

export const StartupSEO = ({ startup, baseUrl = "https://knowfounders.com" }: StartupSEOProps) => {
  const startupUrl = `${baseUrl}/startup/${startup.id}`;
  const imageUrl = startup.cover_image_url || startup.logo_url || `${baseUrl}/default-startup-image.jpg`;
  
  const title = `${startup.name} - ${startup.tagline || 'Startup'} | Know Founders`;
  const description = startup.description.length > 160 
    ? startup.description.substring(0, 157) + "..." 
    : startup.description;

  const keywords = [
    startup.name,
    startup.category?.name || 'startup',
    startup.city,
    startup.state_region,
    startup.stage,
    'non-tech startup',
    'startup directory',
    'entrepreneur',
    'business',
    'founder'
  ].filter(Boolean).join(', ');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": startup.name,
    "description": startup.description,
    "url": startup.website_url || startupUrl,
    "logo": startup.logo_url,
    "image": imageUrl,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": startup.city,
      "addressRegion": startup.state_region,
      "addressCountry": "IN"
    },
    "foundingDate": startup.founded_date,
    "numberOfEmployees": startup.team_size,
    "knowsAbout": [
      startup.category?.name,
      "Non-tech startup",
      "Business innovation"
    ].filter(Boolean),
    "sameAs": startup.website_url ? [startup.website_url] : [],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/explore?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <SEOHead
      title={title}
      description={description}
      keywords={keywords}
      image={imageUrl}
      url={startupUrl}
      type="article"
      structuredData={structuredData}
    />
  );
};
