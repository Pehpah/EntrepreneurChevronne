import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  // Load theme from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const { simpleIndexedDB } = await import('../utils/simpleIndexedDB');
        const saved = await simpleIndexedDB.getItem<string>('blog-theme');
        if (saved && (saved === 'light' || saved === 'dark')) {
          setTheme(saved as Theme);
        }
      } catch (error) {
        console.error('Error loading theme from storage:', error);
      }
    };
    loadTheme();
  }, []);

  // Save theme to storage and apply to document
  useEffect(() => {
    const saveTheme = async () => {
      try {
        const { simpleIndexedDB } = await import('../utils/simpleIndexedDB');
        await simpleIndexedDB.setItem('blog-theme', theme);
      } catch (error) {
        console.error('Error saving theme to storage:', error);
      }
    };
    
    saveTheme();
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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