import { useState, useEffect } from 'react';

// Utility to check localStorage quota
const getStorageSize = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
};

// Clean old analytics data when storage is full
const cleanupAnalyticsData = () => {
  try {
    const keys = Object.keys(localStorage);
    const analyticsKeys = keys.filter(key => 
      key.startsWith('analytics-') || 
      key.startsWith('blog-analytics')
    );
    
    // Keep only recent data (last 30 days for pageviews, last 1000 events)
    analyticsKeys.forEach(key => {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(data)) {
          if (key.includes('pageviews') || key.includes('events')) {
            // Keep only last 1000 items
            const cleaned = data.slice(-1000);
            localStorage.setItem(key, JSON.stringify(cleaned));
          } else if (key.includes('sessions')) {
            // Keep only last 100 sessions
            const cleaned = data.slice(-100);
            localStorage.setItem(key, JSON.stringify(cleaned));
          }
        }
      } catch (e) {
        // If parsing fails, remove the key
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error cleaning analytics data:', error);
  }
};

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      const serializedValue = JSON.stringify(valueToStore);
      
      // Check if we're approaching quota limits
      const currentSize = getStorageSize();
      const estimatedNewSize = currentSize + serializedValue.length;
      
      // If approaching 4MB limit (localStorage is usually 5-10MB)
      if (estimatedNewSize > 4 * 1024 * 1024) {
        console.warn('localStorage approaching quota, cleaning up analytics data...');
        cleanupAnalyticsData();
      }
      
      window.localStorage.setItem(key, serializedValue);
    } catch (error) {
      if (error instanceof DOMException && error.code === 22) {
        // Quota exceeded error
        console.warn('localStorage quota exceeded, attempting cleanup...');
        cleanupAnalyticsData();
        
        // Try again after cleanup
        try {
          const valueToStore = value instanceof Function ? value(storedValue) : value;
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          setStoredValue(valueToStore);
        } catch (secondError) {
          console.error(`Failed to save to localStorage even after cleanup for key "${key}":`, secondError);
          // Don't update state if we can't persist
        }
      } else {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    }
  };

  return [storedValue, setValue] as const;
}