import { Article, Category } from '../types';
import { SEOData } from '../hooks/useSEO';

export const defaultSEO: SEOData = {
  title: 'Entrepreneur Chevronné - Votre guide vers le succès entrepreneurial',
  description: 'Découvrez des conseils pratiques, stratégies et témoignages pour développer votre entreprise. Gestion quotidienne, marketing, finance et productivité pour entrepreneurs.',
  keywords: [
    'entrepreneur',
    'entreprise',
    'gestion',
    'marketing',
    'stratégie',
    'finance',
    'productivité',
    'business',
    'startup',
    'conseils',
    'témoignages',
    'success stories'
  ],
  image: '/og-image.jpg',
  url: '/',
};

export function generateArticleSEO(article: Article, category?: Category): SEOData {
  const categoryName = category?.name || article.category;
  
  return {
    title: `${article.title} | Entrepreneur Chevronné`,
    description: article.excerpt,
    keywords: [
      ...article.tags,
      categoryName.toLowerCase(),
      'entrepreneur',
      'entreprise',
      'conseils',
      'business'
    ],
    image: article.image,
    url: `/article/${article.id}`,
    author: article.author,
    publishedTime: article.publishedAt,
    section: categoryName,
    tags: article.tags,
  };
}

export function generateCategorySEO(category: Category, articleCount: number): SEOData {
  return {
    title: `${category.name} - Conseils et stratégies | Entrepreneur Chevronné`,
    description: `${category.description} Découvrez ${articleCount} articles sur ${category.name.toLowerCase()} pour développer votre entreprise.`,
    keywords: [
      category.name.toLowerCase(),
      category.slug,
      'entrepreneur',
      'entreprise',
      'conseils',
      'stratégies',
      'business'
    ],
    image: '/og-image.jpg',
    url: `/category/${category.slug}`,
    section: category.name,
  };
}

export function generatePageSEO(pageName: string, description: string): SEOData {
  return {
    title: `${pageName} | Entrepreneur Chevronné`,
    description,
    keywords: [
      pageName.toLowerCase(),
      'entrepreneur',
      'entreprise',
      'business'
    ],
    image: '/og-image.jpg',
    url: `/${pageName.toLowerCase().replace(/\s+/g, '-')}`,
  };
}

export function generateSearchSEO(query: string, resultCount: number): SEOData {
  return {
    title: `Recherche: "${query}" | Entrepreneur Chevronné`,
    description: `${resultCount} résultat${resultCount > 1 ? 's' : ''} trouvé${resultCount > 1 ? 's' : ''} pour "${query}". Découvrez nos articles sur l'entrepreneuriat et le business.`,
    keywords: [
      query,
      'recherche',
      'entrepreneur',
      'entreprise',
      'articles',
      'business'
    ],
    image: '/og-image.jpg',
    url: `/search?q=${encodeURIComponent(query)}`,
  };
}

// Fonction utilitaire pour nettoyer et optimiser les mots-clés
export function optimizeKeywords(keywords: string[]): string[] {
  return keywords
    .map(keyword => keyword.toLowerCase().trim())
    .filter((keyword, index, array) => 
      keyword.length > 2 && array.indexOf(keyword) === index
    )
    .slice(0, 15); // Limiter à 15 mots-clés maximum
}

// Fonction pour générer une description optimisée
export function generateMetaDescription(content: string, maxLength: number = 160): string {
  const cleanContent = content
    .replace(/<[^>]*>/g, '') // Supprimer les balises HTML
    .replace(/\s+/g, ' ') // Normaliser les espaces
    .trim();

  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  // Couper au dernier espace avant la limite
  const truncated = cleanContent.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > maxLength * 0.8 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
}