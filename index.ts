// =============================================================================
// INDEX - Point d'entrée principal
// =============================================================================

// Theme Context exports
export {
  default as ThemeContext,
  ThemeProvider,
  useTheme,
  useIsDarkTheme,
  useThemeClasses,
  type Theme
} from './ThemeContext';

// =============================================================================
// Types généraux
// =============================================================================

export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ComponentProps extends BaseProps {
  id?: string;
  'data-testid'?: string;
}

// =============================================================================
// Utilitaires
// =============================================================================

/**
 * Combine plusieurs classes CSS en une seule chaîne
 * @param classes - Classes CSS à combiner
 * @returns Chaîne de classes combinées
 */
export const cn = (...classes: (string | undefined | null | boolean)[]): string => {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
};

/**
 * Utilitaire pour créer des variantes de composants
 * @param base - Classes de base
 * @param variants - Objet des variantes
 * @param defaultVariant - Variante par défaut
 */
export const createVariants = <T extends Record<string, Record<string, string>>>(
  base: string,
  variants: T,
  defaultVariant?: Partial<{ [K in keyof T]: keyof T[K] }>
) => {
  return (props: Partial<{ [K in keyof T]: keyof T[K] }> = {}) => {
    const variantClasses = Object.entries(variants).map(([key, variantMap]) => {
      const selectedVariant = props[key as keyof T] || defaultVariant?.[key as keyof T];
      return selectedVariant ? variantMap[selectedVariant as string] : '';
    });

    return cn(base, ...variantClasses);
  };
};

// =============================================================================
// Constantes
// =============================================================================

export const THEME_STORAGE_KEY = 'theme';

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const;

// =============================================================================
// Hooks utilitaires
// =============================================================================

/**
 * Hook pour gérer l'état local avec localStorage
 * @param key - Clé de stockage
 * @param initialValue - Valeur initiale
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  // État pour stocker notre valeur
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Fonction pour définir la valeur
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Hook pour détecter si on est côté client
 */
export const useIsClient = (): boolean => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

/**
 * Hook pour gérer les media queries
 * @param query - Media query à écouter
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

// =============================================================================
// Import React pour les hooks
// =============================================================================
import React from 'react';

// =============================================================================
// Version et informations du package
// =============================================================================

export const VERSION = '1.0.0';
export const PACKAGE_NAME = 'theme-components';

// =============================================================================
// Configuration par défaut
// =============================================================================

export const DEFAULT_CONFIG = {
  theme: {
    defaultTheme: 'light' as const,
    storageKey: THEME_STORAGE_KEY,
    attribute: 'data-theme',
    enableSystem: true,
  },
  components: {
    classNamePrefix: '',
    defaultVariant: 'default',
  },
} as const;

// =============================================================================
// Exports par défaut
// =============================================================================

export default {
  VERSION,
  PACKAGE_NAME,
  DEFAULT_CONFIG,
  BREAKPOINTS,
  COLORS,
};