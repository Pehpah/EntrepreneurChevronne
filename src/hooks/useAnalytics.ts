import { useCallback } from 'react';

interface AnalyticsEvent {
  [key: string]: any;
}

export function useAnalytics() {
  const trackPageView = useCallback((path: string, title: string) => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: title,
        page_location: window.location.origin + path,
      });
    }

    // Console logging pour le développement
    if (import.meta.env.DEV) {
      console.log('📊 Page View:', { path, title });
    }
  }, []);

  const trackEvent = useCallback((eventName: string, parameters: AnalyticsEvent = {}) => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, parameters);
    }

    // Console logging pour le développement
    if (import.meta.env.DEV) {
      console.log('📊 Event:', eventName, parameters);
    }
  }, []);

  const trackSearch = useCallback((searchTerm: string) => {
    trackEvent('search', {
      search_term: searchTerm,
    });
  }, [trackEvent]);

  const trackArticleRead = useCallback((articleId: string, readingTime: number) => {
    trackEvent('article_read', {
      article_id: articleId,
      reading_time: readingTime,
    });
  }, [trackEvent]);

  const trackNewsletterSubscribe = useCallback((email: string) => {
    trackEvent('newsletter_subscribe', {
      method: 'blog_form',
    });
  }, [trackEvent]);

  const trackContactForm = useCallback((formType: string) => {
    trackEvent('contact_form_submit', {
      form_type: formType,
    });
  }, [trackEvent]);

  return {
    trackPageView,
    trackEvent,
    trackSearch,
    trackArticleRead,
    trackNewsletterSubscribe,
    trackContactForm,
  };
}

// Déclaration pour TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}