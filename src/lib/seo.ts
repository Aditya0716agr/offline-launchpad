// SEO utility functions for URL generation and optimization

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export const generateStartupURL = (startupName: string, city?: string): string => {
  const slug = generateSlug(startupName);
  const citySlug = city ? generateSlug(city) : '';
  return citySlug ? `/startups/${slug}/${citySlug}` : `/startups/${slug}`;
};

export const generateCategoryURL = (category: string, city?: string): string => {
  const categorySlug = generateSlug(category);
  const citySlug = city ? generateSlug(city) : '';
  return citySlug ? `/explore/${categorySlug}/${citySlug}` : `/explore/${categorySlug}`;
};

export const generateFounderURL = (founderName: string): string => {
  const slug = generateSlug(founderName);
  return `/founders/${slug}`;
};

export const generateBlogURL = (title: string): string => {
  const slug = generateSlug(title);
  return `/blog/${slug}`;
};

// Structured data generators
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Know Founders",
  "alternateName": "KnowFounders",
  "url": "https://knowfounders.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://knowfounders.com/logo.png",
    "width": 200,
    "height": 200
  },
  "description": "Discover innovative non-tech startups and connect with entrepreneurs. The largest community of non-tech founders in India.",
  "foundingDate": "2024",
  "founder": {
    "@type": "Person",
    "name": "Know Founders Team"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN"
  },
  "sameAs": [
    "https://twitter.com/knowfounders",
    "https://www.linkedin.com/company/knowfounders",
    "https://facebook.com/knowfounders",
    "https://instagram.com/knowfounders"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "hello@knowfounders.com",
    "availableLanguage": "English"
  },
  "knowsAbout": [
    "Non-tech startups",
    "Startup directory",
    "Entrepreneur networking",
    "Business discovery",
    "Startup funding",
    "Cofounder matching"
  ],
  "areaServed": {
    "@type": "Country",
    "name": "India"
  },
  "serviceType": "Startup Discovery Platform"
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Know Founders",
  "alternateName": "KnowFounders",
  "url": "https://knowfounders.com",
  "description": "Discover innovative non-tech startups and connect with entrepreneurs",
  "inLanguage": "en-US",
  "isAccessibleForFree": true,
  "publisher": {
    "@type": "Organization",
    "name": "Know Founders",
    "url": "https://knowfounders.com"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://knowfounders.com/explore?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "mainEntity": {
    "@type": "ItemList",
    "name": "Non-Tech Startups Directory",
    "description": "Comprehensive directory of non-tech startups in India"
  }
});

export const generateStartupSchema = (startup: any) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": startup.name,
  "alternateName": startup.tagline,
  "description": startup.description,
  "url": startup.website_url || `https://knowfounders.com/startups/${startup.slug || startup.id}`,
  "logo": {
    "@type": "ImageObject",
    "url": startup.logo_url,
    "width": 200,
    "height": 200
  },
  "image": startup.gallery_images?.map((img: string) => ({
    "@type": "ImageObject",
    "url": img
  })),
  "address": {
    "@type": "PostalAddress",
    "addressLocality": startup.city,
    "addressRegion": startup.state_region,
    "addressCountry": "IN",
    "streetAddress": startup.full_address
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": startup.email_contact,
    "telephone": startup.phone_number,
    "contactType": "customer service",
    "availableLanguage": "English"
  },
  "sameAs": [
    startup.social_instagram,
    startup.social_facebook,
    startup.social_linkedin,
    startup.social_twitter
  ].filter(Boolean),
  "foundingDate": startup.launch_date,
  "numberOfEmployees": startup.team_size,
  "knowsAbout": startup.categories?.name,
  "areaServed": {
    "@type": "Country",
    "name": "India"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Services",
    "itemListElement": startup.looking_for?.map((item: string) => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": item
      }
    }))
  },
  "aggregateRating": startup.rating ? {
    "@type": "AggregateRating",
    "ratingValue": startup.rating,
    "reviewCount": startup.review_count || 0,
    "bestRating": 5,
    "worstRating": 1
  } : undefined,
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "Stage",
      "value": startup.stage
    },
    {
      "@type": "PropertyValue", 
      "name": "Category",
      "value": startup.categories?.name
    },
    {
      "@type": "PropertyValue",
      "name": "View Count",
      "value": startup.view_count
    }
  ].filter(prop => prop.value)
});

export const generateBreadcrumbSchema = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const generateArticleSchema = (article: any) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "image": article.image,
  "author": {
    "@type": "Organization",
    "name": "Know Founders"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Know Founders",
    "logo": {
      "@type": "ImageObject",
      "url": "https://knowfounders.com/logo.png"
    }
  },
  "datePublished": article.published_at,
  "dateModified": article.updated_at,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url
  }
});

// Meta tag generators
export const generateMetaTitle = (title: string, siteName: string = "Know Founders"): string => {
  return title.includes(siteName) ? title : `${title} | ${siteName}`;
};

export const generateMetaDescription = (description: string, maxLength: number = 160): string => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3) + '...';
};

export const generateKeywords = (baseKeywords: string[], additionalKeywords: string[] = []): string => {
  const allKeywords = [...baseKeywords, ...additionalKeywords];
  return [...new Set(allKeywords)].join(', ');
};

// Additional structured data generators
export const generateWebApplicationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Know Founders",
  "alternateName": "KnowFounders",
  "description": "Discover innovative non-tech startups and connect with entrepreneurs. Browse startup directory, find cofounders, get funding, and join the largest community of non-tech founders in India.",
  "url": "https://knowfounders.com",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "browserRequirements": "Requires JavaScript. Requires HTML5.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Startup Directory",
    "Startup Discovery",
    "Founder Networking",
    "Cofounder Matching",
    "Business Directory",
    "Startup Search",
    "Startup Analytics",
    "Community Features"
  ],
  "screenshot": "https://storage.googleapis.com/gpt-engineer-file-uploads/OVYktJbw3tZiZkzBsvSWWp5ISb23/social-images/social-1759048575325-Screenshot%202025-09-28%20140608.png",
  "softwareVersion": "1.0",
  "datePublished": "2024-01-01",
  "dateModified": new Date().toISOString(),
  "author": {
    "@type": "Organization",
    "name": "Know Founders"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Know Founders",
    "url": "https://knowfounders.com"
  }
});

export const generateLocalBusinessSchema = (startup: any) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": startup.name,
  "description": startup.description,
  "url": startup.website_url || `https://knowfounders.com/startups/${startup.slug || startup.id}`,
  "telephone": startup.phone_number,
  "email": startup.email_contact,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": startup.full_address,
    "addressLocality": startup.city,
    "addressRegion": startup.state_region,
    "addressCountry": "IN"
  },
  "geo": startup.latitude && startup.longitude ? {
    "@type": "GeoCoordinates",
    "latitude": startup.latitude,
    "longitude": startup.longitude
  } : undefined,
  "openingHours": "Mo-Su 00:00-23:59",
  "priceRange": "$$",
  "paymentAccepted": "Cash, Credit Card, Digital Payment",
  "currenciesAccepted": "INR",
  "areaServed": {
    "@type": "Country",
    "name": "India"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Services",
    "itemListElement": startup.looking_for?.map((item: string) => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": item
      }
    }))
  },
  "sameAs": [
    startup.social_instagram,
    startup.social_facebook,
    startup.social_linkedin,
    startup.social_twitter
  ].filter(Boolean)
});

export const generateFAQSchema = (faqs: Array<{question: string, answer: string}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const generateHowToSchema = (steps: Array<{name: string, text: string, url?: string}>) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Discover Non-Tech Startups",
  "description": "Learn how to find and connect with innovative non-tech startups using Know Founders platform",
  "step": steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "name": step.name,
    "text": step.text,
    "url": step.url
  }))
});

export const generateEventSchema = (event: any) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": event.name,
  "description": event.description,
  "startDate": event.startDate,
  "endDate": event.endDate,
  "location": {
    "@type": "Place",
    "name": event.location,
    "address": event.address
  },
  "organizer": {
    "@type": "Organization",
    "name": "Know Founders",
    "url": "https://knowfounders.com"
  },
  "offers": {
    "@type": "Offer",
    "price": event.price || "0",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock"
  }
});

export const generatePersonSchema = (person: any) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": person.full_name,
  "description": person.bio,
  "image": person.avatar_url,
  "jobTitle": "Founder",
  "worksFor": {
    "@type": "Organization",
    "name": person.startup_name
  },
  "knowsAbout": [
    "Entrepreneurship",
    "Non-tech startups",
    "Business development"
  ],
  "sameAs": [
    person.social_linkedin,
    person.social_twitter
  ].filter(Boolean)
});

export const generateCollectionPageSchema = (page: any) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": page.name,
  "description": page.description,
  "url": page.url,
  "mainEntity": {
    "@type": "ItemList",
    "name": page.name,
    "description": page.description,
    "numberOfItems": page.itemCount,
    "itemListElement": page.items?.map((item: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Organization",
        "name": item.name,
        "url": item.url
      }
    }))
  }
});
