import { useState, useEffect, useCallback } from 'react';
import { simpleIndexedDB } from '../utils/simpleIndexedDB';

export function useSimpleStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial value
  useEffect(() => {
    const loadValue = async () => {
      try {
        const item = await simpleIndexedDB.getItem<T>(key, initialValue);
        if (item !== null) {
          setStoredValue(item);
        }
      } catch (error) {
        console.error(`Error loading from storage (${key}):`, error);
        setStoredValue(initialValue);
      } finally {
        setIsInitialized(true);
      }
    };

    loadValue();
  }, [key, initialValue]);

  // Set value function
  const setValue = useCallback(async (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Update state immediately for better UX
      setStoredValue(valueToStore);
      
      // Save to storage asynchronously
      await simpleIndexedDB.setItem(key, valueToStore);
      
    } catch (error) {
      console.error(`Error saving to storage (${key}):`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}