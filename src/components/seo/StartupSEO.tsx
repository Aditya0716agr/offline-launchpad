import { SEOHead } from './SEOHead';
import { generateStartupSchema, generateBreadcrumbSchema, generateMetaTitle, generateMetaDescription } from '@/lib/seo';

interface StartupSEOProps {
  startup: {
    id: string;
    name: string;
    description: string;
    logo_url?: string;
    website_url?: string;
    city?: string;
    state_region?: string;
    category?: string;
    founder_name?: string;
    email_contact?: string;
    phone_number?: string;
    social_instagram?: string;
    social_facebook?: string;
    social_linkedin?: string;
    social_twitter?: string;
    created_at: string;
    updated_at: string;
  };
}

export const StartupSEO = ({ startup }: StartupSEOProps) => {
  const title = generateMetaTitle(`${startup.name} - ${startup.category} Startup in ${startup.city}`);
  const description = generateMetaDescription(
    `Discover ${startup.name}, a ${startup.category} startup in ${startup.city}. ${startup.description}`
  );
  
  const url = `https://knowfounders.com/startup/${startup.id}`;
  const image = startup.logo_url || 'https://knowfounders.com/default-startup-image.jpg';
  
  const structuredData = [
    generateStartupSchema(startup),
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://knowfounders.com' },
      { name: 'Explore', url: 'https://knowfounders.com/explore' },
      { name: startup.category || 'Startup', url: `https://knowfounders.com/explore/${startup.category?.toLowerCase().replace(/\s+/g, '-')}` },
      { name: startup.name, url }
    ])
  ];

  const keywords = [
    startup.name,
    startup.category,
    startup.city,
    startup.state_region,
    'startup',
    'entrepreneur',
    'business',
    'non-tech startup',
    'founder',
    'startup directory'
  ].filter(Boolean).join(', ');

  return (
    <SEOHead
      title={title}
      description={description}
      keywords={keywords}
      image={image}
      url={url}
      type="article"
      structuredData={structuredData}
      publishedTime={startup.created_at}
      modifiedTime={startup.updated_at}
      tags={[startup.category, startup.city].filter(Boolean)}
    />
  );
};