import { useEffect } from 'react';
import { Article } from '../types';

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  url?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export function useSEO(seoData: SEOData, type: 'website' | 'article' = 'website', article?: Article) {
  useEffect(() => {
    // Titre de la page
    document.title = seoData.title;

    // Métadonnées de base
    updateMetaTag('description', seoData.description);
    updateMetaTag('keywords', seoData.keywords.join(', '));

    // Open Graph
    updateMetaProperty('og:title', seoData.title);
    updateMetaProperty('og:description', seoData.description);
    updateMetaProperty('og:type', type);
    updateMetaProperty('og:url', seoData.url || window.location.href);
    updateMetaProperty('og:site_name', 'Entrepreneur Chevronné');
    updateMetaProperty('og:locale', 'fr_FR');

    if (seoData.image) {
      updateMetaProperty('og:image', seoData.image);
      updateMetaProperty('og:image:alt', seoData.title);
    }

    // Twitter Card
    updateMetaName('twitter:card', 'summary_large_image');
    updateMetaName('twitter:title', seoData.title);
    updateMetaName('twitter:description', seoData.description);
    if (seoData.image) {
      updateMetaName('twitter:image', seoData.image);
    }

    // Métadonnées spécifiques aux articles
    if (type === 'article' && article) {
      updateMetaProperty('article:author', seoData.author || 'Entrepreneur Chevronné');
      updateMetaProperty('article:published_time', seoData.publishedTime || article.publishedAt);
      updateMetaProperty('article:modified_time', seoData.modifiedTime || article.publishedAt);
      updateMetaProperty('article:section', seoData.section || article.category);
      
      // Tags d'article
      if (seoData.tags) {
        // Supprimer les anciens tags
        removeMetaProperties('article:tag');
        // Ajouter les nouveaux tags
        seoData.tags.forEach(tag => {
          addMetaProperty('article:tag', tag);
        });
      }
    }

    // JSON-LD Schema
    updateJSONLD(seoData, type, article);

  }, [seoData, type, article]);
}

function updateMetaTag(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateMetaProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateMetaName(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function addMetaProperty(property: string, content: string) {
  const meta = document.createElement('meta');
  meta.setAttribute('property', property);
  meta.content = content;
  document.head.appendChild(meta);
}

function removeMetaProperties(property: string) {
  const metas = document.querySelectorAll(`meta[property="${property}"]`);
  metas.forEach(meta => meta.remove());
}

function updateJSONLD(seoData: SEOData, type: 'website' | 'article', article?: Article) {
  // Supprimer l'ancien script JSON-LD
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  let jsonLD: any;

  if (type === 'article' && article) {
    jsonLD = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: seoData.title,
      description: seoData.description,
      image: seoData.image,
      author: {
        '@type': 'Person',
        name: seoData.author || 'Entrepreneur Chevronné',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Entrepreneur Chevronné',
        logo: {
          '@type': 'ImageObject',
          url: '/logo.png',
        },
      },
      datePublished: seoData.publishedTime || article.publishedAt,
      dateModified: seoData.modifiedTime || article.publishedAt,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': seoData.url || window.location.href,
      },
    };
  } else {
    jsonLD = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Entrepreneur Chevronné',
      description: seoData.description,
      url: seoData.url || window.location.origin,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${window.location.origin}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
  }

  // Ajouter le nouveau script JSON-LD
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLD);
  document.head.appendChild(script);
}