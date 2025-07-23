import { useEffect, useCallback } from 'react';
import { AnalyticsEvent, PageView, UserSession, AnalyticsMetrics } from '../types';
import { useLocalStorage } from './useLocalStorage';

// Configuration des limites de données
const ANALYTICS_LIMITS = {
  maxPageViews: 500,
  maxEvents: 1000,
  maxSessions: 50,
  cleanupThreshold: 0.8 // Nettoyer quand on atteint 80% des limites
};

export function useAnalytics() {
  const [events, setEvents] = useLocalStorage<AnalyticsEvent[]>('analytics-events', []);
  const [pageViews, setPageViews] = useLocalStorage<PageView[]>('analytics-pageviews', []);
  const [sessions, setSessions] = useLocalStorage<UserSession[]>('analytics-sessions', []);
  const [currentSession, setCurrentSession] = useLocalStorage<UserSession | null>('current-session', null);

  // Fonction de nettoyage intelligent
  const cleanupOldData = useCallback(() => {
    // Nettoyer les pageViews si nécessaire
    if (pageViews.length > ANALYTICS_LIMITS.maxPageViews * ANALYTICS_LIMITS.cleanupThreshold) {
      const cleanedPageViews = pageViews.slice(-ANALYTICS_LIMITS.maxPageViews);
      setPageViews(cleanedPageViews);
      console.log(`🧹 PageViews nettoyées: ${pageViews.length} → ${cleanedPageViews.length}`);
    }

    // Nettoyer les events si nécessaire
    if (events.length > ANALYTICS_LIMITS.maxEvents * ANALYTICS_LIMITS.cleanupThreshold) {
      const cleanedEvents = events.slice(-ANALYTICS_LIMITS.maxEvents);
      setEvents(cleanedEvents);
      console.log(`🧹 Events nettoyés: ${events.length} → ${cleanedEvents.length}`);
    }

    // Nettoyer les sessions si nécessaire
    if (sessions.length > ANALYTICS_LIMITS.maxSessions * ANALYTICS_LIMITS.cleanupThreshold) {
      const cleanedSessions = sessions.slice(-ANALYTICS_LIMITS.maxSessions);
      setSessions(cleanedSessions);
      console.log(`🧹 Sessions nettoyées: ${sessions.length} → ${cleanedSessions.length}`);
    }
  }, [pageViews, events, sessions, setPageViews, setEvents, setSessions]);

  // Nettoyage automatique à l'initialisation
  useEffect(() => {
    cleanupOldData();
  }, []);

  // Session management
  useEffect(() => {
    if (!currentSession) {
      const newSession: UserSession = {
        id: Date.now().toString(),
        startTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        pageViews: 0,
        events: 0,
        deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        referrer: document.referrer || 'direct',
      };
      setCurrentSession(newSession);
    }
  }, [currentSession, setCurrentSession]);

  const trackPageView = useCallback((path: string, title: string) => {
    const pageView: PageView = {
      id: Date.now().toString(),
      path,
      title,
      timestamp: new Date().toISOString(),
      sessionId: currentSession?.id || '',
      referrer: document.referrer || 'direct',
    };

    // Ajouter avec rotation automatique
    setPageViews(prev => {
      const updated = [...prev, pageView];
      // Garder seulement les N derniers
      return updated.length > ANALYTICS_LIMITS.maxPageViews 
        ? updated.slice(-ANALYTICS_LIMITS.maxPageViews)
        : updated;
    });

    // Update current session
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        lastActivity: new Date().toISOString(),
        pageViews: currentSession.pageViews + 1,
      };
      setCurrentSession(updatedSession);

      // Update sessions array
      setSessions(prev => {
        const filtered = prev.filter(s => s.id !== currentSession.id);
        const updated = [...filtered, updatedSession];
        // Garder seulement les N dernières sessions
        return updated.length > ANALYTICS_LIMITS.maxSessions
          ? updated.slice(-ANALYTICS_LIMITS.maxSessions)
          : updated;
      });
    }
  }, [currentSession, setPageViews, setCurrentSession, setSessions]);

  const trackEvent = useCallback((eventType: string, data?: any) => {
    const event: AnalyticsEvent = {
      id: Date.now().toString(),
      type: eventType,
      data: data || {},
      timestamp: new Date().toISOString(),
      sessionId: currentSession?.id || '',
      path: window.location.pathname,
    };

    // Ajouter avec rotation automatique
    setEvents(prev => {
      const updated = [...prev, event];
      // Garder seulement les N derniers
      return updated.length > ANALYTICS_LIMITS.maxEvents
        ? updated.slice(-ANALYTICS_LIMITS.maxEvents)
        : updated;
    });

    // Update current session
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        lastActivity: new Date().toISOString(),
        events: currentSession.events + 1,
      };
      setCurrentSession(updatedSession);
    }
  }, [currentSession, setEvents, setCurrentSession]);

  const trackSearch = useCallback((query: string) => {
    trackEvent('search', { query, timestamp: new Date().toISOString() });
  }, [trackEvent]);

  const trackArticleRead = useCallback((articleId: string, readPercentage: number) => {
    trackEvent('article_read', { articleId, readPercentage });
  }, [trackEvent]);

  const getMetrics = useCallback((): AnalyticsMetrics => {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Filtrer les données récentes seulement
    const recentPageViews = pageViews.filter(pv => new Date(pv.timestamp) > last30Days);
    const recentEvents = events.filter(e => new Date(e.timestamp) > last30Days);
    const recentSessions = sessions.filter(s => new Date(s.startTime) > last30Days);

    const uniqueVisitors = new Set(recentPageViews.map(pv => pv.sessionId)).size;
    const totalPageViews = recentPageViews.length;

    // Calculate metrics from recent data only
    const averageSessionDuration = recentSessions.length > 0
      ? recentSessions.reduce((acc, session) => {
          const start = new Date(session.startTime).getTime();
          const end = new Date(session.lastActivity).getTime();
          return acc + (end - start);
        }, 0) / recentSessions.length / 1000 / 60 // en minutes
      : 0;

    const bounceRate = recentSessions.length > 0
      ? (recentSessions.filter(s => s.pageViews <= 1).length / recentSessions.length) * 100
      : 0;

    // Top pages (limité aux 10 premiers)
    const pageStats = recentPageViews.reduce((acc, pv) => {
      acc[pv.path] = (acc[pv.path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPages = Object.entries(pageStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([page, views]) => ({ page, views }));

    // Top articles (limité aux 10 premiers)
    const articleViews = recentEvents
      .filter(e => e.type === 'article_view')
      .reduce((acc, e) => {
        const title = e.data?.title || 'Article inconnu';
        acc[title] = (acc[title] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topArticles = Object.entries(articleViews)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([title, views]) => ({ title, views }));

    // Device breakdown
    const deviceBreakdown = recentSessions.reduce((acc, session) => {
      const device = session.deviceType;
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, { desktop: 0, tablet: 0, mobile: 0 });

    // Traffic sources
    const trafficSources = recentSessions.reduce((acc, session) => {
      if (session.referrer === 'direct') acc.direct++;
      else if (session.referrer.includes('google')) acc.search++;
      else if (session.referrer.includes('facebook') || session.referrer.includes('twitter')) acc.social++;
      else acc.referral++;
      return acc;
    }, { direct: 0, search: 0, social: 0, referral: 0 });

    // Daily views (derniers 30 jours seulement)
    const dailyViews = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const views = recentPageViews.filter(pv => 
        pv.timestamp.startsWith(dateStr)
      ).length;
      dailyViews.push({ date: dateStr, views });
    }

    return {
      totalPageViews,
      uniqueVisitors,
      averageSessionDuration,
      bounceRate,
      topPages,
      topArticles,
      topCategories: [], // Simplifier pour éviter trop de données
      topSearchQueries: [], // Simplifier pour éviter trop de données
      deviceBreakdown,
      trafficSources,
      dailyViews,
      weeklyViews: [], // Simplifier pour éviter trop de données
      monthlyViews: [], // Simplifier pour éviter trop de données
    };
  }, [pageViews, events, sessions]);

  return {
    trackPageView,
    trackEvent,
    trackSearch,
    trackArticleRead,
    getMetrics,
    // Exposer les données pour debug (limitées)
    pageViewsCount: pageViews.length,
    eventsCount: events.length,
    sessionsCount: sessions.length,
    cleanupOldData, // Fonction de nettoyage manuel
  };
}