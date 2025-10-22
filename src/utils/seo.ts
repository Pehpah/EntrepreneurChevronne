import { Article, Category } from '../types';

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export const defaultSEO: SEOData = {
  title: 'Entrepreneur Chevronné - Blog Entrepreneuriat & Business',
  description: 'Découvrez les stratégies, outils et témoignages d\'entrepreneurs qui ont transformé leur vision en réalité. Rejoignez une communauté de leaders visionnaires.',
  keywords: ['entrepreneuriat', 'business', 'startup', 'stratégie', 'marketing', 'finance', 'productivité'],
  image: 'https://entrepreneur-chevronne.com/og-image.jpg',
  type: 'website'
};

export const generateArticleSEO = (article: Article, category?: Category): SEOData => {
  return {
    title: `${article.title} | Entrepreneur Chevronné`,
    description: article.excerpt,
    keywords: [...article.tags, 'entrepreneuriat', category?.name || ''].filter(Boolean),
    canonical: `https://entrepreneur-chevronne.com/article/${article.id}`,
    image: article.image,
    type: 'article',
    publishedTime: article.publishedAt,
    modifiedTime: article.publishedAt,
    author: article.author,
    section: category?.name,
    tags: article.tags
  };
};

export const generateCategorySEO = (category: Category, articlesCount: number): SEOData => {
  return {
    title: `${category.name} - Conseils et Stratégies | Entrepreneur Chevronné`,
    description: `${category.description}. Découvrez ${articlesCount} articles sur ${category.name.toLowerCase()} pour entrepreneurs.`,
    keywords: [category.name.toLowerCase(), 'entrepreneuriat', 'conseils', 'stratégies'],
    canonical: `https://entrepreneur-chevronne.com/category/${category.slug}`,
    type: 'website'
  };
};

export const generateSearchSEO = (query: string, resultsCount: number): SEOData => {
  return {
    title: `Recherche: "${query}" | Entrepreneur Chevronné`,
    description: `${resultsCount} résultats trouvés pour "${query}". Découvrez nos articles sur l'entrepreneuriat et le business.`,
    keywords: [query, 'recherche', 'entrepreneuriat'],
    type: 'website'
  };
};

export const updateMetaTags = (seo: SEOData) => {
  // Update title
  document.title = seo.title;

  // Update or create meta tags
  const updateMeta = (name: string, content: string, property = false) => {
    const attribute = property ? 'property' : 'name';
    let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    
    meta.content = content;
  };

  // Basic meta tags
  updateMeta('description', seo.description);
  updateMeta('keywords', seo.keywords.join(', '));

  // Open Graph tags
  updateMeta('og:title', seo.title, true);
  updateMeta('og:description', seo.description, true);
  updateMeta('og:type', seo.type || 'website', true);
  updateMeta('og:site_name', 'Entrepreneur Chevronné', true);
  
  if (seo.image) {
    updateMeta('og:image', seo.image, true);
    updateMeta('og:image:alt', seo.title, true);
  }

  if (seo.canonical) {
    updateMeta('og:url', seo.canonical, true);
    
    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = seo.canonical;
  }

  // Twitter Card tags
  updateMeta('twitter:card', 'summary_large_image');
  updateMeta('twitter:title', seo.title);
  updateMeta('twitter:description', seo.description);
  if (seo.image) {
    updateMeta('twitter:image', seo.image);
  }

  // Article specific tags
  if (seo.type === 'article') {
    if (seo.publishedTime) {
      updateMeta('article:published_time', seo.publishedTime, true);
    }
    if (seo.modifiedTime) {
      updateMeta('article:modified_time', seo.modifiedTime, true);
    }
    if (seo.author) {
      updateMeta('article:author', seo.author, true);
    }
    if (seo.section) {
      updateMeta('article:section', seo.section, true);
    }
    if (seo.tags) {
      seo.tags.forEach(tag => {
        const tagMeta = document.createElement('meta');
        tagMeta.setAttribute('property', 'article:tag');
        tagMeta.content = tag;
        document.head.appendChild(tagMeta);
      });
    }
  }
};

export const generateStructuredData = (type: 'website' | 'article' | 'organization', data: any) => {
  let structuredData: any = {
    '@context': 'https://schema.org'
  };

  switch (type) {
    case 'website':
      structuredData = {
        ...structuredData,
        '@type': 'WebSite',
        name: 'Entrepreneur Chevronné',
        url: 'https://entrepreneur-chevronne.com',
        description: defaultSEO.description,
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://entrepreneur-chevronne.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      };
      break;

    case 'article':
      const article = data as Article;
      structuredData = {
        ...structuredData,
        '@type': 'Article',
        headline: article.title,
        description: article.excerpt,
        image: article.image,
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        author: {
          '@type': 'Person',
          name: article.author
        },
        publisher: {
          '@type': 'Organization',
          name: 'Entrepreneur Chevronné',
          logo: {
            '@type': 'ImageObject',
            url: 'https://entrepreneur-chevronne.com/logo.png'
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://entrepreneur-chevronne.com/article/${article.id}`
        },
        keywords: article.tags.join(', ')
      };
      break;

    case 'organization':
      structuredData = {
        ...structuredData,
        '@type': 'Organization',
        name: 'Entrepreneur Chevronné',
        url: 'https://entrepreneur-chevronne.com',
        logo: 'https://entrepreneur-chevronne.com/logo.png',
        description: defaultSEO.description,
        sameAs: [
          'https://twitter.com/entrepreneur_chevronne',
          'https://linkedin.com/company/entrepreneur-chevronne'
        ]
      };
      break;
  }

  return structuredData;
};

export const updateStructuredData = (structuredData: any) => {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
};

export const generateSitemap = (articles: Article[], categories: Category[]) => {
  const baseUrl = 'https://entrepreneur-chevronne.com';
  const now = new Date().toISOString();

  const urls = [
    {
      loc: baseUrl,
      lastmod: now,
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      loc: `${baseUrl}/a-propos`,
      lastmod: now,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/annonceur`,
      lastmod: now,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/ressources`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '0.8'
    },
    ...categories.map(category => ({
      loc: `${baseUrl}/category/${category.slug}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '0.8'
    })),
    ...articles.map(article => ({
      loc: `${baseUrl}/article/${article.id}`,
      lastmod: article.publishedAt,
      changefreq: 'monthly',
      priority: '0.9'
    }))
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};