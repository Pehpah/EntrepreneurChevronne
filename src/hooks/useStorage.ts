import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';

export function useStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Load initial value
  useEffect(() => {
    const loadValue = async () => {
      try {
        const item = await storage.getItem<T>(key, initialValue);
        if (item !== null) {
          setStoredValue(item);
        }
      } catch (error) {
        console.error(`Error loading from storage (${key}):`, error);
        setStoredValue(initialValue);
      }
    };

    loadValue();
  }, [key, initialValue]);

  // Set value function
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Update state immediately for better UX
      setStoredValue(valueToStore);
      
      // Save to storage asynchronously (don't await to avoid blocking UI)
      storage.setItem(key, valueToStore).catch(error => {
        console.error(`Error saving to storage (${key}):`, error);
      });
      
    } catch (error) {
      console.error(`Error in setValue (${key}):`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}