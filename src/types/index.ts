export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: number;
  image: string;
  tags: string[];
  featured?: boolean;
}

export interface Comment {
  id: string;
  articleId: string;
  author: string;
  email: string;
  content: string;
  publishedAt: string;
  replies?: Comment[];
}

export interface NewsletterSubscriber {
  email: string;
  subscribedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  sponsor: string;
  position: 'sidebar' | 'article-top' | 'article-middle' | 'article-bottom' | 'header' | 'footer' | 'between-articles';
  isActive: boolean;
  startDate: string;
  endDate: string;
  clickCount: number;
  impressions: number;
  priority: number; // 1-10, higher = more priority
}

export interface AdPlacement {
  position: string;
  maxAds: number;
  enabled: boolean;
}