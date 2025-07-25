import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types pour le thème
export type Theme = 'light' | 'dark';

// Interface pour le contexte du thème
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Création du contexte
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Props pour le provider
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

// Hook personnalisé pour utiliser le contexte du thème
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Provider du contexte du thème
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'light' 
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Vérifier d'abord le localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        return savedTheme;
      }
      
      // Si pas de thème sauvegardé, vérifier la préférence système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    
    return defaultTheme;
  });

  // Sauvegarder le thème dans localStorage et appliquer la classe CSS
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      
      // Appliquer la classe au document
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      
      // Optionnel: définir l'attribut data-theme
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Écouter les changements de préférence système
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        // Ne changer automatiquement que si aucun thème n'est sauvegardé
        const savedTheme = localStorage.getItem('theme');
        if (!savedTheme) {
          setThemeState(e.matches ? 'dark' : 'light');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const toggleTheme = () => {
    setThemeState(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook pour vérifier si le thème sombre est actif
export const useIsDarkTheme = (): boolean => {
  const { theme } = useTheme();
  return theme === 'dark';
};

// Hook pour obtenir les classes CSS basées sur le thème
export const useThemeClasses = () => {
  const { theme } = useTheme();
  
  return {
    background: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    card: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    hover: theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
  };
};

export default ThemeContext;