import { useState, useEffect, useCallback } from 'react';
import { indexedDB } from '../utils/indexedDB';

export function useIndexedDB<T>(storeName: string, key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial value
  useEffect(() => {
    const loadValue = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const item = await indexedDB.getItem<T>(storeName, key, initialValue);
        if (item !== null) {
          setStoredValue(item);
        }
      } catch (err) {
        console.error(`Error loading from IndexedDB (${key}):`, err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setStoredValue(initialValue);
      } finally {
        setIsLoading(false);
      }
    };

    loadValue();
  }, [storeName, key, initialValue]);

  // Set value function
  const setValue = useCallback(async (value: T | ((val: T) => T)) => {
    try {
      setError(null);
      
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save to IndexedDB
      await indexedDB.setItem(storeName, key, valueToStore);
      
      // Update state
      setStoredValue(valueToStore);
      
    } catch (err) {
      console.error(`Error saving to IndexedDB (${key}):`, err);
      setError(err instanceof Error ? err.message : 'Failed to save data');
      
      // Still update local state even if save fails
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    }
  }, [storeName, key, storedValue]);

  // Remove value function
  const removeValue = useCallback(async () => {
    try {
      setError(null);
      await indexedDB.removeItem(storeName, key);
      setStoredValue(initialValue);
    } catch (err) {
      console.error(`Error removing from IndexedDB (${key}):`, err);
      setError(err instanceof Error ? err.message : 'Failed to remove data');
    }
  }, [storeName, key, initialValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    isLoading,
    error
  };
}

// Simplified version that matches the original useLocalStorage API
export function useIndexedDBSimple<T>(storeName: string, key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const { value, setValue } = useIndexedDB(storeName, key, initialValue);
  return [value, setValue];
}