import { useEffect } from 'react';
import { 
  SEOData, 
  updateMetaTags, 
  updateStructuredData, 
  generateStructuredData,
  defaultSEO 
} from '../utils/seo';

export function useSEO(seoData: SEOData, structuredDataType?: 'website' | 'article' | 'organization', structuredDataContent?: any) {
  useEffect(() => {
    // Update meta tags
    updateMetaTags(seoData);

    // Update structured data if provided
    if (structuredDataType && structuredDataContent) {
      const structuredData = generateStructuredData(structuredDataType, structuredDataContent);
      updateStructuredData(structuredData);
    }

    // Cleanup function to reset to default SEO when component unmounts
    return () => {
      updateMetaTags(defaultSEO);
      if (structuredDataType) {
        const defaultStructuredData = generateStructuredData('website', null);
        updateStructuredData(defaultStructuredData);
      }
    };
  }, [seoData, structuredDataType, structuredDataContent]);
}

export function usePageSEO(title: string, description: string, keywords: string[] = []) {
  const seoData: SEOData = {
    title: `${title} | Entrepreneur Chevronné`,
    description,
    keywords: [...keywords, 'entrepreneuriat', 'business'],
    type: 'website'
  };

  useSEO(seoData);
}