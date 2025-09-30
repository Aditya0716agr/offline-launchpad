// Analytics utility functions for tracking user interactions
// Replace GA_MEASUREMENT_ID and YOUR_PIXEL_ID with actual IDs when available

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
  }
}

// Google Analytics tracking
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Meta Pixel tracking
export const trackPixelEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters);
  }
};

// Common tracking events
export const trackSignup = (method: 'email' | 'google' = 'email') => {
  trackEvent('sign_up', 'engagement', method);
  trackPixelEvent('CompleteRegistration', {
    content_name: 'User Registration',
    content_category: 'engagement',
  });
};

export const trackLogin = (method: 'email' | 'google' = 'email') => {
  trackEvent('login', 'engagement', method);
  trackPixelEvent('Login', {
    content_name: 'User Login',
    content_category: 'engagement',
  });
};

export const trackStartupSubmission = (startupName: string, category: string) => {
  trackEvent('startup_submission', 'engagement', category);
  trackPixelEvent('Lead', {
    content_name: 'Startup Submission',
    content_category: category,
    value: startupName,
  });
};

export const trackPageView = (pageName: string) => {
  trackEvent('page_view', 'navigation', pageName);
  trackPixelEvent('ViewContent', {
    content_name: pageName,
    content_category: 'navigation',
  });
};

export const trackButtonClick = (buttonName: string, location: string) => {
  trackEvent('click', 'engagement', `${buttonName}_${location}`);
  trackPixelEvent('ViewContent', {
    content_name: buttonName,
    content_category: 'button_click',
    content_ids: [location],
  });
};

export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent('search', 'engagement', searchTerm, resultsCount);
  trackPixelEvent('Search', {
    search_string: searchTerm,
    content_category: 'search',
  });
};

export const trackStartupView = (startupId: string, startupName: string) => {
  trackEvent('startup_view', 'engagement', startupName);
  trackPixelEvent('ViewContent', {
    content_name: startupName,
    content_category: 'startup',
    content_ids: [startupId],
  });
};

export const trackVote = (startupId: string, startupName: string) => {
  trackEvent('vote', 'engagement', startupName);
  trackPixelEvent('AddToWishlist', {
    content_name: startupName,
    content_category: 'startup_vote',
    content_ids: [startupId],
  });
};

export const trackBookmark = (startupId: string, startupName: string) => {
  trackEvent('bookmark', 'engagement', startupName);
  trackPixelEvent('AddToWishlist', {
    content_name: startupName,
    content_category: 'startup_bookmark',
    content_ids: [startupId],
  });
};

// Track urgency banner interactions
export const trackUrgencyBannerClick = (action: 'claim_badge' | 'signup') => {
  trackEvent('urgency_banner_click', 'conversion', action);
  trackPixelEvent('InitiateCheckout', {
    content_name: 'Urgency Banner',
    content_category: 'conversion',
    value: action,
  });
};

// Track founding member badge claim
export const trackFoundingMemberClaim = () => {
  trackEvent('founding_member_claim', 'conversion', 'badge_claim');
  trackPixelEvent('Purchase', {
    content_name: 'Founding Member Badge',
    content_category: 'conversion',
    value: 'founding_member',
  });
};

