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

export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'article_view' | 'article_read' | 'comment_add' | 'newsletter_signup' | 'ad_click' | 'search' | 'category_view';
  timestamp: string;
  data: {
    page?: string;
    articleId?: string;
    category?: string;
    searchQuery?: string;
    adId?: string;
    duration?: number;
    scrollDepth?: number;
    referrer?: string;
    userAgent?: string;
    sessionId?: string;
  };
}

export interface PageView {
  id: string;
  path: string;
  title: string;
  timestamp: string;
  duration?: number;
  scrollDepth?: number;
  referrer?: string;
  sessionId: string;
}

export interface UserSession {
  id: string;
  startTime: string;
  endTime?: string;
  pageViews: number;
  events: number;
  isReturning: boolean;
  source?: string;
  device?: 'desktop' | 'tablet' | 'mobile';
}

export interface AnalyticsMetrics {
  totalPageViews: number;
  uniqueVisitors: number;
  averageSessionDuration: number;
  bounceRate: number;
  topPages: { path: string; views: number; title: string }[];
  topArticles: { id: string; views: number; title: string }[];
  topCategories: { slug: string; views: number; name: string }[];
  topSearchQueries: { query: string; count: number }[];
  deviceBreakdown: { desktop: number; tablet: number; mobile: number };
  trafficSources: { source: string; count: number }[];
  dailyViews: { date: string; views: number }[];
  weeklyViews: { week: string; views: number }[];
  monthlyViews: { month: string; views: number }[];
}