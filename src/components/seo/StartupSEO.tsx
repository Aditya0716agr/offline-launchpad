import { SEOHead } from './SEOHead';
import { generateStartupSchema, generateLocalBusinessSchema, generateBreadcrumbSchema } from '@/lib/seo';

interface Startup {
  id: string;
  name: string;
  slug: string;
  description: string;
  tagline: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  gallery_images: string[] | null;
  location: string | null;
  city: string | null;
  state_region: string | null;
  full_address: string | null;
  website_url: string | null;
  whatsapp_link: string | null;
  email_contact: string | null;
  phone_number: string | null;
  social_instagram: string | null;
  social_facebook: string | null;
  social_linkedin: string | null;
  social_twitter: string | null;
  team_size: string | null;
  stage: string | null;
  looking_for: string[] | null;
  launch_date: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  categories: {
    name: string;
    slug: string;
  } | null;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    is_founding_member: boolean;
    bio: string | null;
  };
}

interface StartupSEOProps {
  startup: Startup;
}

export const StartupSEO = ({ startup }: StartupSEOProps) => {
  const title = `${startup.name} - ${startup.tagline || startup.description.substring(0, 50)}... | Know Founders`;
  const description = startup.description.length > 160 
    ? startup.description.substring(0, 157) + '...'
    : startup.description;
  
  const keywords = [
    startup.name,
    startup.categories?.name || '',
    startup.location || '',
    startup.stage || '',
    'non-tech startup',
    'startup directory',
    'entrepreneur',
    'founder',
    'business directory',
    'startup discovery'
  ].filter(Boolean).join(', ');

  const image = startup.cover_image_url || startup.logo_url || 'https://storage.googleapis.com/gpt-engineer-file-uploads/OVYktJbw3tZiZkzBsvSWWp5ISb23/social-images/social-1759048575325-Screenshot%202025-09-28%20140608.png';
  
  const url = `https://knowfounders.com/startups/${startup.slug || startup.id}`;

  const breadcrumbs = [
    { name: 'Home', url: 'https://knowfounders.com' },
    { name: 'Startups', url: 'https://knowfounders.com/explore' },
    { name: startup.categories?.name || 'Startup', url: `https://knowfounders.com/explore/${startup.categories?.slug || ''}` },
    { name: startup.name, url }
  ];

  const structuredData = [
    generateStartupSchema(startup),
    generateLocalBusinessSchema(startup),
    generateBreadcrumbSchema(breadcrumbs)
  ];

  const faq = [
    {
      question: `What is ${startup.name}?`,
      answer: startup.description
    },
    {
      question: `What stage is ${startup.name} in?`,
      answer: startup.stage ? `${startup.name} is currently in the ${startup.stage} stage.` : `${startup.name} is an active startup.`
    },
    {
      question: `Where is ${startup.name} located?`,
      answer: startup.location ? `${startup.name} is located in ${startup.location}.` : `${startup.name} operates in India.`
    },
    {
      question: `How can I contact ${startup.name}?`,
      answer: startup.website_url 
        ? `You can visit their website at ${startup.website_url} or contact them through the platform.`
        : `You can contact ${startup.name} through the Know Founders platform.`
    }
  ];

  return (
    <SEOHead
      title={title}
      description={description}
      keywords={keywords}
      image={image}
      url={url}
      type="article"
      structuredData={structuredData}
      breadcrumbs={breadcrumbs}
      faq={faq}
      publishedTime={startup.created_at}
      modifiedTime={startup.updated_at}
      section={startup.categories?.name}
      tags={startup.looking_for || []}
      geo={{
        placename: startup.location,
        region: startup.state_region
      }}
    />
  );
};