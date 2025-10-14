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
  return citySlug ? `/startup/${slug}/${citySlug}` : `/startup/${slug}`;
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
  "url": "https://knowfounders.com",
  "logo": "https://knowfounders.com/logo.png",
  "description": "Discover innovative non-tech startups and connect with entrepreneurs. The largest community of non-tech founders in India.",
  "sameAs": [
    "https://twitter.com/knowfounders",
    "https://www.linkedin.com/company/know-founder"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "hertofhelp@gmail.com"
  }
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Know Founders",
  "url": "https://knowfounders.com",
  "description": "Discover innovative non-tech startups and connect with entrepreneurs",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://knowfounders.com/explore?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});

export const generateStartupSchema = (startup: any) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": startup.name,
  "description": startup.description,
  "url": startup.website_url,
  "logo": startup.logo_url,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": startup.city,
    "addressRegion": startup.state_region,
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": startup.email_contact,
    "telephone": startup.phone_number
  },
  "sameAs": [
    startup.social_instagram,
    startup.social_facebook,
    startup.social_linkedin,
    startup.social_twitter
  ].filter(Boolean)
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
