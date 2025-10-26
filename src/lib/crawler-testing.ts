// Crawler testing and validation utilities
export const testCrawlerCompatibility = () => {
  const results = {
    metaTags: false,
    structuredData: false,
    images: false,
    links: false,
    performance: false,
    accessibility: false,
    errors: [] as string[]
  };

  try {
    // Test meta tags
    const title = document.querySelector('title');
    const description = document.querySelector('meta[name="description"]');
    const robots = document.querySelector('meta[name="robots"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    
    if (title && description && robots && canonical) {
      results.metaTags = true;
    } else {
      results.errors.push('Missing essential meta tags');
    }

    // Test structured data
    const structuredData = document.querySelector('script[type="application/ld+json"]');
    if (structuredData) {
      try {
        JSON.parse(structuredData.textContent || '');
        results.structuredData = true;
      } catch (e) {
        results.errors.push('Invalid structured data JSON');
      }
    } else {
      results.errors.push('No structured data found');
    }

    // Test images
    const images = document.querySelectorAll('img');
    let imagesWithAlt = 0;
    images.forEach(img => {
      if (img.getAttribute('alt')) {
        imagesWithAlt++;
      }
    });
    
    if (images.length === 0 || imagesWithAlt === images.length) {
      results.images = true;
    } else {
      results.errors.push(`${images.length - imagesWithAlt} images missing alt text`);
    }

    // Test links
    const links = document.querySelectorAll('a[href]');
    let validLinks = 0;
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href.startsWith('http') || href.startsWith('/') || href.startsWith('#'))) {
        validLinks++;
      }
    });
    
    if (links.length === 0 || validLinks === links.length) {
      results.links = true;
    } else {
      results.errors.push(`${links.length - validLinks} invalid links found`);
    }

    // Test performance
    const performance = window.performance;
    if (performance && performance.timing) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      if (loadTime < 3000) { // 3 seconds
        results.performance = true;
      } else {
        results.errors.push(`Page load time too slow: ${loadTime}ms`);
      }
    }

    // Test accessibility
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const h1Count = document.querySelectorAll('h1').length;
    
    if (h1Count === 1 && headings.length > 0) {
      results.accessibility = true;
    } else {
      if (h1Count !== 1) {
        results.errors.push(`Expected 1 H1 tag, found ${h1Count}`);
      }
      if (headings.length === 0) {
        results.errors.push('No heading tags found');
      }
    }

  } catch (error) {
    results.errors.push(`Test error: ${error}`);
  }

  return results;
};

// Simulate crawler behavior
export const simulateCrawler = (userAgent: string = 'Googlebot/2.1') => {
  // Override navigator.userAgent
  Object.defineProperty(navigator, 'userAgent', {
    writable: true,
    value: userAgent
  });

  // Disable JavaScript features that crawlers don't support
  const originalConsole = console.log;
  console.log = (...args) => {
    if (userAgent.includes('Googlebot')) {
      // Crawlers don't execute console.log
      return;
    }
    originalConsole.apply(console, args);
  };

  // Simulate crawler rendering
  const crawlerMode = document.documentElement.classList.contains('crawler-mode');
  if (!crawlerMode) {
    document.documentElement.classList.add('crawler-mode');
  }

  return {
    userAgent,
    crawlerMode: true,
    testResults: testCrawlerCompatibility()
  };
};

// Validate crawler-specific requirements
export const validateCrawlerRequirements = () => {
  const requirements = {
    googlebot: {
      javascript: true,
      css: true,
      images: true,
      fonts: true,
      structuredData: true,
      metaTags: true
    },
    bingbot: {
      javascript: true,
      css: true,
      images: true,
      fonts: true,
      structuredData: true,
      metaTags: true
    },
    facebookexternalhit: {
      javascript: false,
      css: true,
      images: true,
      fonts: false,
      structuredData: true,
      metaTags: true,
      openGraph: true
    },
    twitterbot: {
      javascript: false,
      css: true,
      images: true,
      fonts: false,
      structuredData: true,
      metaTags: true,
      twitterCards: true
    }
  };

  const userAgent = navigator.userAgent;
  let crawlerType = 'unknown';
  
  if (userAgent.includes('Googlebot')) crawlerType = 'googlebot';
  else if (userAgent.includes('Bingbot')) crawlerType = 'bingbot';
  else if (userAgent.includes('facebookexternalhit')) crawlerType = 'facebookexternalhit';
  else if (userAgent.includes('Twitterbot')) crawlerType = 'twitterbot';

  const crawlerRequirements = requirements[crawlerType as keyof typeof requirements];
  const validationResults = {
    crawlerType,
    requirements: crawlerRequirements,
    passed: true,
    issues: [] as string[]
  };

  // Validate based on crawler requirements
  if (crawlerRequirements) {
    // Check JavaScript requirement
    if (!crawlerRequirements.javascript) {
      const jsScripts = document.querySelectorAll('script[src]');
      if (jsScripts.length > 0) {
        validationResults.issues.push('JavaScript scripts found but crawler doesn\'t support JS');
      }
    }

    // Check CSS requirement
    if (crawlerRequirements.css) {
      const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
      if (cssLinks.length === 0) {
        validationResults.issues.push('CSS required but no stylesheets found');
      }
    }

    // Check images requirement
    if (crawlerRequirements.images) {
      const images = document.querySelectorAll('img');
      const imagesWithoutAlt = Array.from(images).filter(img => !img.getAttribute('alt'));
      if (imagesWithoutAlt.length > 0) {
        validationResults.issues.push(`${imagesWithoutAlt.length} images missing alt text`);
      }
    }

    // Check structured data requirement
    if (crawlerRequirements.structuredData) {
      const structuredData = document.querySelector('script[type="application/ld+json"]');
      if (!structuredData) {
        validationResults.issues.push('Structured data required but not found');
      }
    }

    // Check Open Graph requirement
    if (crawlerRequirements.openGraph) {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogImage = document.querySelector('meta[property="og:image"]');
      
      if (!ogTitle || !ogDescription || !ogImage) {
        validationResults.issues.push('Open Graph meta tags required but missing');
      }
    }

    // Check Twitter Cards requirement
    if (crawlerRequirements.twitterCards) {
      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      const twitterImage = document.querySelector('meta[name="twitter:image"]');
      
      if (!twitterCard || !twitterTitle || !twitterDescription || !twitterImage) {
        validationResults.issues.push('Twitter Card meta tags required but missing');
      }
    }

    validationResults.passed = validationResults.issues.length === 0;
  }

  return validationResults;
};

// Generate crawler compatibility report
export const generateCrawlerReport = () => {
  const testResults = testCrawlerCompatibility();
  const validationResults = validateCrawlerRequirements();
  
  return {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    testResults,
    validationResults,
    overallScore: calculateOverallScore(testResults, validationResults),
    recommendations: generateRecommendations(testResults, validationResults)
  };
};

// Calculate overall compatibility score
const calculateOverallScore = (testResults: any, validationResults: any) => {
  let score = 0;
  let totalChecks = 0;

  // Test results scoring
  if (testResults.metaTags) score += 20;
  if (testResults.structuredData) score += 20;
  if (testResults.images) score += 15;
  if (testResults.links) score += 10;
  if (testResults.performance) score += 15;
  if (testResults.accessibility) score += 20;
  
  totalChecks = 6;

  // Validation results scoring
  if (validationResults.passed) {
    score += 20;
  } else {
    score += Math.max(0, 20 - (validationResults.issues.length * 5));
  }
  totalChecks++;

  return Math.round((score / (totalChecks * 20)) * 100);
};

// Generate recommendations based on test results
const generateRecommendations = (testResults: any, validationResults: any) => {
  const recommendations = [];

  if (!testResults.metaTags) {
    recommendations.push('Add essential meta tags: title, description, robots, canonical');
  }

  if (!testResults.structuredData) {
    recommendations.push('Add structured data (JSON-LD) for better search engine understanding');
  }

  if (!testResults.images) {
    recommendations.push('Add alt text to all images for better accessibility and SEO');
  }

  if (!testResults.links) {
    recommendations.push('Fix invalid links to improve crawler navigation');
  }

  if (!testResults.performance) {
    recommendations.push('Optimize page load time for better crawler experience');
  }

  if (!testResults.accessibility) {
    recommendations.push('Improve heading structure and accessibility');
  }

  if (validationResults.issues.length > 0) {
    recommendations.push(...validationResults.issues.map((issue: string) => `Fix: ${issue}`));
  }

  return recommendations;
};

// Export for use in development
export const crawlerTestingUtils = {
  testCrawlerCompatibility,
  simulateCrawler,
  validateCrawlerRequirements,
  generateCrawlerReport
};
