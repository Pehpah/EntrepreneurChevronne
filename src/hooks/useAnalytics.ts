import { useState, useEffect, useCallback } from 'react';
import { AnalyticsEvent, PageView, UserSession, AnalyticsMetrics } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useAnalytics() {
  const [events, setEvents] = useLocalStorage<AnalyticsEvent[]>('analytics-events', []);
  const [pageViews, setPageViews] = useLocalStorage<PageView[]>('analytics-pageviews', []);
  const [sessions, setSessions] = useLocalStorage<UserSession[]>('analytics-sessions', []);
  const [currentSession, setCurrentSession] = useLocalStorage<UserSession | null>('current-session', null);

  // Generate unique session ID
  const generateSessionId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Get device type
  const getDeviceType = (): 'desktop' | 'tablet' | 'mobile' => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  // Get traffic source
  const getTrafficSource = (): string => {
    const referrer = document.referrer;
    if (!referrer) return 'direct';
    
    const hostname = new URL(referrer).hostname;
    if (hostname.includes('google')) return 'google';
    if (hostname.includes('facebook')) return 'facebook';
    if (hostname.includes('twitter')) return 'twitter';
    if (hostname.includes('linkedin')) return 'linkedin';
    return 'referral';
  };

  // Initialize or get current session
  const initSession = useCallback(() => {
    if (!currentSession || isSessionExpired(currentSession)) {
      const newSession: UserSession = {
        id: generateSessionId(),
        startTime: new Date().toISOString(),
        pageViews: 0,
        events: 0,
        isReturning: sessions.length > 0,
        source: getTrafficSource(),
        device: getDeviceType()
      };
      
      setCurrentSession(newSession);
      setSessions(prev => [...prev, newSession]);
      return newSession;
    }
    return currentSession;
  }, [currentSession, sessions, setCurrentSession, setSessions]);

  // Check if session is expired (30 minutes of inactivity)
  const isSessionExpired = (session: UserSession): boolean => {
    const lastActivity = new Date(session.endTime || session.startTime);
    const now = new Date();
    return now.getTime() - lastActivity.getTime() > 30 * 60 * 1000; // 30 minutes
  };

  // Track page view
  const trackPageView = useCallback((path: string, title: string) => {
    const session = initSession();
    const pageView: PageView = {
      id: Date.now().toString(),
      path,
      title,
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
      sessionId: session.id
    };

    setPageViews(prev => [...prev, pageView]);
    
    // Update session
    const updatedSession = {
      ...session,
      pageViews: session.pageViews + 1,
      endTime: new Date().toISOString()
    };
    setCurrentSession(updatedSession);
    setSessions(prev => prev.map(s => s.id === session.id ? updatedSession : s));

    // Track as analytics event
    trackEvent('page_view', {
      page: path,
      sessionId: session.id
    });
  }, [initSession, setPageViews, setCurrentSession, setSessions]);

  // Track custom event
  const trackEvent = useCallback((
    type: AnalyticsEvent['type'], 
    data: AnalyticsEvent['data']
  ) => {
    const session = currentSession || initSession();
    const event: AnalyticsEvent = {
      id: Date.now().toString(),
      type,
      timestamp: new Date().toISOString(),
      data: {
        ...data,
        sessionId: session.id,
        userAgent: navigator.userAgent,
        referrer: document.referrer
      }
    };

    setEvents(prev => [...prev, event]);

    // Update session
    const updatedSession = {
      ...session,
      events: session.events + 1,
      endTime: new Date().toISOString()
    };
    setCurrentSession(updatedSession);
    setSessions(prev => prev.map(s => s.id === session.id ? updatedSession : s));
  }, [currentSession, initSession, setEvents, setCurrentSession, setSessions]);

  // Track article reading progress
  const trackArticleRead = useCallback((articleId: string, scrollDepth: number, duration: number) => {
    trackEvent('article_read', {
      articleId,
      scrollDepth,
      duration
    });
  }, [trackEvent]);

  // Track search
  const trackSearch = useCallback((query: string) => {
    trackEvent('search', {
      searchQuery: query
    });
  }, [trackEvent]);

  // Track comment addition
  const trackComment = useCallback((articleId: string) => {
    trackEvent('comment_add', {
      articleId
    });
  }, [trackEvent]);

  // Track newsletter signup
  const trackNewsletterSignup = useCallback(() => {
    trackEvent('newsletter_signup', {});
  }, [trackEvent]);

  // Track ad click
  const trackAdClick = useCallback((adId: string) => {
    trackEvent('ad_click', {
      adId
    });
  }, [trackEvent]);

  // Calculate analytics metrics
  const getMetrics = useCallback((): AnalyticsMetrics => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Filter recent data
    const recentPageViews = pageViews.filter(pv => new Date(pv.timestamp) >= thirtyDaysAgo);
    const recentSessions = sessions.filter(s => new Date(s.startTime) >= thirtyDaysAgo);
    const recentEvents = events.filter(e => new Date(e.timestamp) >= thirtyDaysAgo);

    // Calculate metrics
    const totalPageViews = recentPageViews.length;
    const uniqueVisitors = new Set(recentPageViews.map(pv => pv.sessionId)).size;

    // Average session duration
    const sessionDurations = recentSessions
      .filter(s => s.endTime)
      .map(s => new Date(s.endTime!).getTime() - new Date(s.startTime).getTime());
    const averageSessionDuration = sessionDurations.length > 0 
      ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length / 1000 / 60 // in minutes
      : 0;

    // Bounce rate (sessions with only 1 page view)
    const bouncedSessions = recentSessions.filter(s => s.pageViews === 1).length;
    const bounceRate = recentSessions.length > 0 ? (bouncedSessions / recentSessions.length) * 100 : 0;

    // Top pages
    const pageViewCounts = recentPageViews.reduce((acc, pv) => {
      acc[pv.path] = (acc[pv.path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPages = Object.entries(pageViewCounts)
      .map(([path, views]) => ({
        path,
        views,
        title: recentPageViews.find(pv => pv.path === path)?.title || path
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Top articles
    const articleViews = recentEvents
      .filter(e => e.type === 'article_view' && e.data.articleId)
      .reduce((acc, e) => {
        const articleId = e.data.articleId!;
        acc[articleId] = (acc[articleId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topArticles = Object.entries(articleViews)
      .map(([id, views]) => ({ id, views, title: `Article ${id}` }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Top categories
    const categoryViews = recentEvents
      .filter(e => e.type === 'category_view' && e.data.category)
      .reduce((acc, e) => {
        const category = e.data.category!;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryViews)
      .map(([slug, views]) => ({ slug, views, name: slug }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Top search queries
    const searchQueries = recentEvents
      .filter(e => e.type === 'search' && e.data.searchQuery)
      .reduce((acc, e) => {
        const query = e.data.searchQuery!;
        acc[query] = (acc[query] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topSearchQueries = Object.entries(searchQueries)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Device breakdown
    const deviceCounts = recentSessions.reduce((acc, s) => {
      const device = s.device || 'desktop';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, { desktop: 0, tablet: 0, mobile: 0 });

    // Traffic sources
    const sourceCounts = recentSessions.reduce((acc, s) => {
      const source = s.source || 'direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const trafficSources = Object.entries(sourceCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    // Daily views for last 30 days
    const dailyViews = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const views = recentPageViews.filter(pv => 
        pv.timestamp.startsWith(dateStr)
      ).length;
      dailyViews.push({ date: dateStr, views });
    }

    // Weekly views for last 12 weeks
    const weeklyViews = [];
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      const views = pageViews.filter(pv => {
        const pvDate = new Date(pv.timestamp);
        return pvDate >= weekStart && pvDate < weekEnd;
      }).length;
      weeklyViews.push({ 
        week: `${weekStart.toISOString().split('T')[0]} - ${weekEnd.toISOString().split('T')[0]}`, 
        views 
      });
    }

    // Monthly views for last 12 months
    const monthlyViews = [];
    for (let i = 11; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = month.toISOString().slice(0, 7); // YYYY-MM
      const views = pageViews.filter(pv => 
        pv.timestamp.startsWith(monthStr)
      ).length;
      monthlyViews.push({ month: monthStr, views });
    }

    return {
      totalPageViews,
      uniqueVisitors,
      averageSessionDuration,
      bounceRate,
      topPages,
      topArticles,
      topCategories,
      topSearchQueries,
      deviceBreakdown: deviceCounts,
      trafficSources,
      dailyViews,
      weeklyViews,
      monthlyViews
    };
  }, [pageViews, sessions, events]);

  // Initialize session on mount
  useEffect(() => {
    initSession();
  }, [initSession]);

  return {
    trackPageView,
    trackEvent,
    trackArticleRead,
    trackSearch,
    trackComment,
    trackNewsletterSignup,
    trackAdClick,
    getMetrics,
    events,
    pageViews,
    sessions,
    currentSession
  };
}