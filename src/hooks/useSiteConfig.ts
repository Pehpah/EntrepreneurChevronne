import { useCallback } from 'react';
import { SiteConfiguration } from '../types';
import { defaultSiteConfig } from '../data/siteConfig';
import { useLocalStorage } from './useLocalStorage';

export function useSiteConfig() {
  const [siteConfig, setSiteConfig] = useLocalStorage<SiteConfiguration>('blog-site-config', defaultSiteConfig);

  const updateLogo = useCallback((logoData: Partial<SiteConfiguration['logo']>) => {
    setSiteConfig(prev => ({
      ...prev,
      logo: { ...prev.logo, ...logoData }
    }));
  }, [setSiteConfig]);

  const updateHero = useCallback((heroData: Partial<SiteConfiguration['hero']>) => {
    setSiteConfig(prev => ({
      ...prev,
      hero: { ...prev.hero, ...heroData }
    }));
  }, [setSiteConfig]);

  const updateTheme = useCallback((themeData: Partial<SiteConfiguration['theme']>) => {
    setSiteConfig(prev => ({
      ...prev,
      theme: { ...prev.theme, ...themeData }
    }));
  }, [setSiteConfig]);

  const resetToDefault = useCallback(() => {
    setSiteConfig(defaultSiteConfig);
  }, [setSiteConfig]);

  return {
    siteConfig,
    updateLogo,
    updateHero,
    updateTheme,
    resetToDefault,
  };
}