// JavaScript optimization for crawlers
export const optimizeJavaScriptForCrawlers = () => {
  // Check if we're in a crawler environment
  const isCrawler = () => {
    const userAgent = navigator.userAgent;
    const crawlerPatterns = [
      'Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider', 
      'YandexBot', 'Applebot', 'facebookexternalhit', 'Twitterbot',
      'LinkedInBot', 'Pinterestbot', 'WhatsApp', 'TelegramBot'
    ];
    return crawlerPatterns.some(pattern => 
      userAgent.toLowerCase().includes(pattern.toLowerCase())
    );
  };

  // Defer non-critical JavaScript for crawlers
  const deferNonCriticalJS = () => {
    if (isCrawler()) {
      // Remove analytics scripts
      const analyticsScripts = document.querySelectorAll('script[src*="googletagmanager"], script[src*="google-analytics"], script[src*="facebook.net"]');
      analyticsScripts.forEach(script => script.remove());

      // Remove ad scripts
      const adScripts = document.querySelectorAll('script[src*="googlesyndication"], script[src*="adsbygoogle"]');
      adScripts.forEach(script => script.remove());

      // Defer non-essential scripts
      const nonEssentialScripts = document.querySelectorAll('script[data-defer="true"]');
      nonEssentialScripts.forEach(script => {
        script.setAttribute('defer', 'true');
      });
    }
  };

  // Optimize images for crawlers
  const optimizeImagesForCrawlers = () => {
    if (isCrawler()) {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        // Add loading="eager" for above-the-fold images
        if (img.getBoundingClientRect().top < window.innerHeight) {
          img.setAttribute('loading', 'eager');
        } else {
          img.setAttribute('loading', 'lazy');
        }
        
        // Ensure alt text is present
        if (!img.getAttribute('alt')) {
          img.setAttribute('alt', 'Image');
        }
      });
    }
  };

  // Optimize CSS for crawlers
  const optimizeCSSForCrawlers = () => {
    if (isCrawler()) {
      // Preload critical CSS
      const criticalCSS = document.querySelector('link[rel="stylesheet"][data-critical="true"]');
      if (criticalCSS) {
        criticalCSS.setAttribute('rel', 'preload');
        criticalCSS.setAttribute('as', 'style');
        criticalCSS.setAttribute('onload', 'this.onload=null;this.rel="stylesheet"');
      }

      // Defer non-critical CSS
      const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"][data-defer="true"]');
      nonCriticalCSS.forEach(link => {
        link.setAttribute('rel', 'preload');
        link.setAttribute('as', 'style');
        link.setAttribute('onload', 'this.onload=null;this.rel="stylesheet"');
      });
    }
  };

  // Optimize fonts for crawlers
  const optimizeFontsForCrawlers = () => {
    if (isCrawler()) {
      // Preload critical fonts
      const criticalFonts = document.querySelectorAll('link[rel="preload"][as="font"]');
      criticalFonts.forEach(font => {
        font.setAttribute('crossorigin', 'anonymous');
      });

      // Use font-display: swap for better performance
      const style = document.createElement('style');
      style.textContent = `
        @font-face {
          font-family: 'Inter';
          font-display: swap;
        }
      `;
      document.head.appendChild(style);
    }
  };

  // Initialize optimizations
  const init = () => {
    deferNonCriticalJS();
    optimizeImagesForCrawlers();
    optimizeCSSForCrawlers();
    optimizeFontsForCrawlers();
  };

  // Run optimizations when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    isCrawler,
    deferNonCriticalJS,
    optimizeImagesForCrawlers,
    optimizeCSSForCrawlers,
    optimizeFontsForCrawlers
  };
};

// Critical resource loader for crawlers
export const loadCriticalResources = () => {
  const isCrawler = () => {
    const userAgent = navigator.userAgent;
    return /Googlebot|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Applebot/i.test(userAgent);
  };

  if (isCrawler()) {
    // Load critical CSS immediately
    const criticalCSS = document.createElement('link');
    criticalCSS.rel = 'stylesheet';
    criticalCSS.href = '/critical.css';
    criticalCSS.setAttribute('data-critical', 'true');
    document.head.appendChild(criticalCSS);

    // Load critical fonts
    const criticalFont = document.createElement('link');
    criticalFont.rel = 'preload';
    criticalFont.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
    criticalFont.as = 'style';
    criticalFont.crossOrigin = 'anonymous';
    document.head.appendChild(criticalFont);

    // Load critical JavaScript
    const criticalJS = document.createElement('script');
    criticalJS.src = '/critical.js';
    criticalJS.setAttribute('data-critical', 'true');
    document.head.appendChild(criticalJS);
  }
};

// Progressive enhancement for crawlers
export const progressiveEnhancement = () => {
  const isCrawler = () => {
    const userAgent = navigator.userAgent;
    return /Googlebot|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Applebot/i.test(userAgent);
  };

  if (isCrawler()) {
    // Add crawler-specific classes
    document.documentElement.classList.add('crawler-mode');
    
    // Disable animations for crawlers
    const style = document.createElement('style');
    style.textContent = `
      .crawler-mode * {
        animation: none !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);

    // Ensure all interactive elements are accessible
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    interactiveElements.forEach(element => {
      if (!element.getAttribute('aria-label') && !element.textContent) {
        element.setAttribute('aria-label', 'Interactive element');
      }
    });
  }
};

// Error handling for crawlers
export const crawlerErrorHandling = () => {
  const isCrawler = () => {
    const userAgent = navigator.userAgent;
    return /Googlebot|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Applebot/i.test(userAgent);
  };

  if (isCrawler()) {
    // Global error handler for crawlers
    window.addEventListener('error', (event) => {
      console.log('Crawler error handled:', event.error);
      // Don't throw errors that might break crawler rendering
      event.preventDefault();
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.log('Crawler promise rejection handled:', event.reason);
      event.preventDefault();
    });
  }
};

// Initialize all crawler optimizations
export const initCrawlerOptimizations = () => {
  optimizeJavaScriptForCrawlers();
  loadCriticalResources();
  progressiveEnhancement();
  crawlerErrorHandling();
};
