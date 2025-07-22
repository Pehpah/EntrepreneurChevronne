import { useState, useEffect } from 'react';
import { Advertisement } from '../types';
import { advertisements as initialAds } from '../data/advertisements';
import { useLocalStorage } from './useLocalStorage';

export function useAdvertisements() {
  const [ads, setAds] = useLocalStorage<Advertisement[]>('blog-advertisements', initialAds);
  const [adStats, setAdStats] = useLocalStorage<Record<string, { clicks: number; impressions: number }>>('ad-stats', {});

  // Get active ads for a specific position
  const getAdsByPosition = (position: Advertisement['position'], limit?: number) => {
    const now = new Date();
    const activeAds = ads
      .filter(ad => 
        ad.isActive && 
        ad.position === position &&
        new Date(ad.startDate) <= now &&
        new Date(ad.endDate) >= now
      )
      .sort((a, b) => b.priority - a.priority);

    return limit ? activeAds.slice(0, limit) : activeAds;
  };

  // Track ad impression
  const trackImpression = (adId: string) => {
    setAds(prevAds => 
      prevAds.map(ad => 
        ad.id === adId 
          ? { ...ad, impressions: ad.impressions + 1 }
          : ad
      )
    );

    setAdStats(prev => ({
      ...prev,
      [adId]: {
        clicks: prev[adId]?.clicks || 0,
        impressions: (prev[adId]?.impressions || 0) + 1
      }
    }));
  };

  // Track ad click
  const trackClick = (adId: string, targetUrl: string) => {
    setAds(prevAds => 
      prevAds.map(ad => 
        ad.id === adId 
          ? { ...ad, clickCount: ad.clickCount + 1 }
          : ad
      )
    );

    setAdStats(prev => ({
      ...prev,
      [adId]: {
        clicks: (prev[adId]?.clicks || 0) + 1,
        impressions: prev[adId]?.impressions || 0
      }
    }));

    // Open in new tab
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  // Get ad performance stats
  const getAdStats = (adId: string) => {
    const ad = ads.find(a => a.id === adId);
    const stats = adStats[adId] || { clicks: 0, impressions: 0 };
    
    return {
      ...stats,
      ctr: stats.impressions > 0 ? (stats.clicks / stats.impressions * 100).toFixed(2) : '0.00',
      totalClicks: ad?.clickCount || 0,
      totalImpressions: ad?.impressions || 0
    };
  };

  // Add new advertisement
  const addAdvertisement = (newAd: Omit<Advertisement, 'id' | 'clickCount' | 'impressions'>) => {
    const ad: Advertisement = {
      ...newAd,
      id: Date.now().toString(),
      clickCount: 0,
      impressions: 0
    };
    setAds(prev => [...prev, ad]);
  };

  // Update advertisement
  const updateAdvertisement = (adId: string, updates: Partial<Advertisement>) => {
    setAds(prev => 
      prev.map(ad => 
        ad.id === adId ? { ...ad, ...updates } : ad
      )
    );
  };

  // Delete advertisement
  const deleteAdvertisement = (adId: string) => {
    setAds(prev => prev.filter(ad => ad.id !== adId));
  };

  return {
    ads,
    getAdsByPosition,
    trackImpression,
    trackClick,
    getAdStats,
    addAdvertisement,
    updateAdvertisement,
    deleteAdvertisement
  };
}