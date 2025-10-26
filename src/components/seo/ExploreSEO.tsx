import { SEOHead } from './SEOHead';
import { generateCollectionPageSchema, generateBreadcrumbSchema } from '@/lib/seo';

interface ExploreSEOProps {
  startups?: any[];
  categories?: any[];
  selectedCategory?: string;
  selectedLocation?: string;
  searchTerm?: string;
}

export const ExploreSEO = ({ 
  startups = [], 
  categories = [], 
  selectedCategory, 
  selectedLocation, 
  searchTerm 
}: ExploreSEOProps) => {
  const getTitle = () => {
    if (searchTerm) {
      return `Search Results for "${searchTerm}" | Startup Directory | Know Founders`;
    }
    if (selectedCategory && selectedLocation) {
      return `${selectedCategory} Startups in ${selectedLocation} | Know Founders`;
    }
    if (selectedCategory) {
      return `${selectedCategory} Startups | Startup Directory | Know Founders`;
    }
    if (selectedLocation) {
      return `Startups in ${selectedLocation} | Know Founders`;
    }
    return 'Discover Non-Tech Startups | Startup Directory | Know Founders';
  };

  const getDescription = () => {
    if (searchTerm) {
      return `Find startups matching "${searchTerm}". Browse our comprehensive directory of non-tech startups and connect with entrepreneurs.`;
    }
    if (selectedCategory && selectedLocation) {
      return `Discover ${selectedCategory.toLowerCase()} startups in ${selectedLocation}. Browse innovative businesses, connect with founders, and explore opportunities.`;
    }
    if (selectedCategory) {
      return `Explore ${selectedCategory.toLowerCase()} startups. Find innovative businesses, connect with founders, and discover opportunities in the startup ecosystem.`;
    }
    if (selectedLocation) {
      return `Find startups in ${selectedLocation}. Discover innovative businesses, connect with local founders, and explore the startup ecosystem.`;
    }
    return 'Discover innovative non-tech startups across India. Browse our comprehensive directory, find cofounders, get funding, and join the largest community of non-tech founders.';
  };

  const getKeywords = () => {
    const baseKeywords = [
      'startup directory',
      'discover startups',
      'non-tech startups',
      'startup search',
      'find startups',
      'startup discovery',
      'business directory',
      'entrepreneur directory',
      'startup listing',
      'startup database',
      'startup marketplace',
      'business opportunities',
      'startup investment',
      'founder network',
      'startup community'
    ];

    const additionalKeywords = [];
    
    if (selectedCategory) {
      additionalKeywords.push(selectedCategory.toLowerCase(), `${selectedCategory.toLowerCase()} startups`);
    }
    
    if (selectedLocation) {
      additionalKeywords.push(selectedLocation, `startups in ${selectedLocation}`);
    }
    
    if (searchTerm) {
      additionalKeywords.push(searchTerm, `startups like ${searchTerm}`);
    }

    return [...baseKeywords, ...additionalKeywords].join(', ');
  };

  const title = getTitle();
  const description = getDescription();
  const keywords = getKeywords();
  const url = `https://knowfounders.com/explore${selectedCategory ? `/${selectedCategory}` : ''}${selectedLocation ? `?location=${encodeURIComponent(selectedLocation)}` : ''}${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''}`;

  const breadcrumbs = [
    { name: 'Home', url: 'https://knowfounders.com' },
    { name: 'Explore Startups', url: 'https://knowfounders.com/explore' }
  ];

  if (selectedCategory) {
    breadcrumbs.push({ 
      name: selectedCategory, 
      url: `https://knowfounders.com/explore/${selectedCategory}` 
    });
  }

  const structuredData = [
    generateCollectionPageSchema({
      name: title,
      description: description,
      url: url,
      itemCount: startups.length,
      items: startups.slice(0, 10).map(startup => ({
        name: startup.name,
        url: `https://knowfounders.com/startups/${startup.slug || startup.id}`
      }))
    }),
    generateBreadcrumbSchema(breadcrumbs)
  ];

  const faq = [
    {
      question: 'How do I find startups on Know Founders?',
      answer: 'You can browse startups by category, location, or use the search function to find specific startups. Our directory includes detailed information about each startup including their stage, team size, and contact details.'
    },
    {
      question: 'What types of startups are listed on Know Founders?',
      answer: 'Know Founders focuses on non-tech startups including food & beverage, wellness & health, retail & fashion, services, beauty & personal care, fitness & sports, home & living, education & training, entertainment, travel & hospitality, professional services, and sustainability businesses.'
    },
    {
      question: 'How can I connect with startup founders?',
      answer: 'You can contact founders directly through the platform using the contact information provided on each startup profile. Many startups also include their social media links and website for direct communication.'
    },
    {
      question: 'Is Know Founders free to use?',
      answer: 'Yes, Know Founders is completely free to use. You can browse startups, contact founders, and join the community without any cost.'
    }
  ];

  return (
    <SEOHead
      title={title}
      description={description}
      keywords={keywords}
      url={url}
      structuredData={structuredData}
      breadcrumbs={breadcrumbs}
      faq={faq}
    />
  );
};
