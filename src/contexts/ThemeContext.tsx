import React, { createContext, useContext, useEffect, useState } from 'react';
import { useThemeStorage } from '../hooks/useSupabase';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { value: theme, setValue: setThemeValue, loading } = useThemeStorage();
  const [localTheme, setLocalTheme] = useState<Theme>('light');

  // Utiliser le thème local pendant le chargement, puis synchroniser avec Supabase
  useEffect(() => {
    if (!loading) {
      setLocalTheme(theme);
    }
  }, [theme, loading]);

  useEffect(() => {
    if (localTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [localTheme]);

  const toggleTheme = () => {
    const newTheme = localTheme === 'light' ? 'dark' : 'light';
    setLocalTheme(newTheme);
    setThemeValue(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme: localTheme, toggleTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}