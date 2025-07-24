import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isSystemDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({ 
  children, 
  defaultTheme = 'auto',
  storageKey = 'blog-theme'
}: ThemeProviderProps) {
  // État pour le thème sélectionné par l'utilisateur
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    
    try {
      const saved = localStorage.getItem(storageKey);
      return (saved as Theme) || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  // État pour détecter si le système préfère le mode sombre
  const [isSystemDark, setIsSystemDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Calcul du thème effectif (résolu)
  const actualTheme: 'light' | 'dark' = useMemo(() => {
    if (theme === 'auto') {
      return isSystemDark ? 'dark' : 'light';
    }
    return theme;
  }, [theme, isSystemDark]);

  // Écouter les changements de préférence système
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsSystemDark(e.matches);
    };

    // Méthode moderne
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Fallback pour les navigateurs plus anciens
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Appliquer le thème au DOM
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;
    
    // Supprimer les anciennes classes
    root.classList.remove('light', 'dark');
    
    // Ajouter la nouvelle classe
    root.classList.add(actualTheme);
    
    // Mettre à jour l'attribut data-theme pour CSS custom properties
    root.setAttribute('data-theme', actualTheme);
    
    // Mettre à jour la couleur de la barre d'état mobile
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content', 
        actualTheme === 'dark' ? '#1f2937' : '#ffffff'
      );
    }
  }, [actualTheme]);

  // Fonction pour changer le thème
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, newTheme);
      }
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  // Fonction pour basculer entre light/dark (ignore auto)
  const toggleTheme = () => {
    if (theme === 'auto') {
      // Si on est en auto, basculer vers l'opposé du thème système
      setTheme(isSystemDark ? 'light' : 'dark');
    } else {
      // Sinon, basculer entre light et dark
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  };

  const value: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
    toggleTheme,
    isSystemDark
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte de thème
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

// Hook pour détecter les changements de thème système
export function useSystemTheme() {
  const [isSystemDark, setIsSystemDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsSystemDark(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return isSystemDark;
}

// Composant pour précharger le thème (évite le flash)
export function ThemeScript({ storageKey = 'blog-theme' }: { storageKey?: string }) {
  const script = `
    (function() {
      try {
        const theme = localStorage.getItem('${storageKey}') || 'auto';
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const actualTheme = theme === 'auto' ? (isSystemDark ? 'dark' : 'light') : theme;
        
        document.documentElement.classList.add(actualTheme);
        document.documentElement.setAttribute('data-theme', actualTheme);
        
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
          metaThemeColor.setAttribute('content', actualTheme === 'dark' ? '#1f2937' : '#ffffff');
        }
      } catch (e) {
        console.warn('Theme script error:', e);
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export default ThemeContext;