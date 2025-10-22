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
  topPages: { page: string; views: number }[];
  topArticles: { title: string; views: number }[];
  topCategories: { category: string; views: number }[];
  topSearchQueries: { query: string; count: number }[];
  deviceBreakdown: { desktop: number; tablet: number; mobile: number };
  trafficSources: { direct: number; search: number; social: number; referral: number };
  dailyViews: { date: string; views: number }[];
  weeklyViews: { week: string; views: number }[];
  monthlyViews: { month: string; views: number }[];
}

export interface SiteConfiguration {
  logo: {
    text: string;
    subtitle: string;
    icon: string; // lucide icon name or image URL
    showIcon: boolean;
    showText: boolean;
  };
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    ctaButtons: {
      primary: { text: string; action: string };
      secondary: { text: string; action: string };
    };
    stats: {
      articles: { value: string; label: string };
      users: { value: string; label: string };
      satisfaction: { value: string; label: string };
      growth: { value: string; label: string };
    };
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}

export type UserRole = 'admin' | 'editor' | 'author' | 'contributor';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  articlesCount: number;
  permissions: UserPermissions;
}

export interface UserPermissions {
  canCreateArticles: boolean;
  canEditOwnArticles: boolean;
  canEditAllArticles: boolean;
  canDeleteOwnArticles: boolean;
  canDeleteAllArticles: boolean;
  canPublishArticles: boolean;
  canManageUsers: boolean;
  canManageComments: boolean;
  canManageAds: boolean;
  canManageNewsletter: boolean;
  canViewAnalytics: boolean;
  canManageSettings: boolean;
}

export interface UserInvitation {
  id: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  isAccepted: boolean;
  acceptedAt?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatar?: string;
  permissions: UserPermissions;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: string;
  lastActivity: string;
}

export interface SecuritySettings {
  sessionTimeout: number; // minutes
  maxLoginAttempts: number;
  passwordMinLength: number;
  requireStrongPassword: boolean;
  enableTwoFactor: boolean;
  allowedDomains: string[];
}

export interface LoginAttempt {
  email: string;
  timestamp: string;
  success: boolean;
  ip?: string;
}