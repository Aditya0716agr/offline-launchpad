// Canonical URL utilities for SEO
export const generateCanonicalUrl = (path: string, baseUrl: string = 'https://knowfounders.com'): string => {
  // Remove trailing slash except for root
  const cleanPath = path === '/' ? '/' : path.replace(/\/$/, '');
  
  // Remove query parameters for canonical URLs
  const pathWithoutQuery = cleanPath.split('?')[0];
  
  return `${baseUrl}${pathWithoutQuery}`;
};

export const getCanonicalUrl = (pathname: string, search?: string): string => {
  const baseUrl = 'https://knowfounders.com';
  
  // Handle special cases
  if (pathname === '/home') {
    return `${baseUrl}/`;
  }
  
  // Remove tracking parameters from canonical URLs
  const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'source', 'fbclid', 'gclid'];
  
  if (search) {
    const urlParams = new URLSearchParams(search);
    trackingParams.forEach(param => urlParams.delete(param));
    
    const cleanSearch = urlParams.toString();
    return generateCanonicalUrl(pathname + (cleanSearch ? `?${cleanSearch}` : ''));
  }
  
  return generateCanonicalUrl(pathname);
};

// URL normalization for consistent canonical URLs
export const normalizeUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    
    // Remove trailing slash except for root
    if (urlObj.pathname !== '/' && urlObj.pathname.endsWith('/')) {
      urlObj.pathname = urlObj.pathname.slice(0, -1);
    }
    
    // Remove tracking parameters
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'source', 'fbclid', 'gclid'];
    trackingParams.forEach(param => urlObj.searchParams.delete(param));
    
    return urlObj.toString();
  } catch (error) {
    console.error('Error normalizing URL:', error);
    return url;
  }
};

// Check if URL is canonical
export const isCanonicalUrl = (url: string, canonicalUrl: string): boolean => {
  return normalizeUrl(url) === normalizeUrl(canonicalUrl);
};

// Generate alternate URLs for different locales (if needed in future)
export const generateAlternateUrls = (pathname: string, locales: string[] = []): Array<{locale: string, url: string}> => {
  const baseUrl = 'https://knowfounders.com';
  
  return locales.map(locale => ({
    locale,
    url: `${baseUrl}/${locale}${pathname}`
  }));
};

// Handle pagination canonical URLs
export const getPaginatedCanonicalUrl = (basePath: string, page: number): string => {
  const baseUrl = 'https://knowfounders.com';
  
  if (page === 1) {
    return `${baseUrl}${basePath}`;
  }
  
  return `${baseUrl}${basePath}?page=${page}`;
};

// Handle category canonical URLs
export const getCategoryCanonicalUrl = (categorySlug: string, location?: string): string => {
  const baseUrl = 'https://knowfounders.com';
  
  if (location) {
    return `${baseUrl}/explore/${categorySlug}/${location}`;
  }
  
  return `${baseUrl}/explore/${categorySlug}`;
};

// Handle startup canonical URLs
export const getStartupCanonicalUrl = (startupSlug: string): string => {
  return `https://knowfounders.com/startups/${startupSlug}`;
};

// Handle blog canonical URLs
export const getBlogCanonicalUrl = (blogSlug: string): string => {
  return `https://knowfounders.com/blog/${blogSlug}`;
};
