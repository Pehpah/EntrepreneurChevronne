import { useState, useEffect, useCallback } from 'react';

// Configuration de sécurité pour le stockage
const STORAGE_CONFIG = {
  maxRetries: 3,
  fallbackToMemory: true,
  compressionThreshold: 1024, // Compresser si > 1KB
  quotaWarningThreshold: 0.8, // Alerter à 80% du quota
};

// Cache en mémoire comme fallback
const memoryCache = new Map<string, any>();

// Utilitaires de compression simple
const compress = (data: string): string => {
  // Simple compression: remplacer les répétitions
  return data.replace(/(.)\1{2,}/g, (match, char) => `${char}*${match.length}`);
};

const decompress = (data: string): string => {
  return data.replace(/(.)\*(\d+)/g, (match, char, count) => char.repeat(parseInt(count)));
};

// Vérifier la taille du localStorage
const getStorageSize = (): number => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
};

// Estimer l'espace disponible
const getAvailableSpace = (): number => {
  const maxSize = 5 * 1024 * 1024; // 5MB approximatif
  const currentSize = getStorageSize();
  return maxSize - currentSize;
};

// Nettoyage intelligent par priorité
const cleanupByPriority = (): void => {
  const keys = Object.keys(localStorage);
  
  // Priorité de nettoyage (du moins important au plus important)
  const cleanupOrder = [
    (key: string) => key.includes('analytics-events'),
    (key: string) => key.includes('analytics-pageviews'),
    (key: string) => key.includes('analytics-sessions'),
    (key: string) => key.includes('temp-') || key.includes('cache-'),
    (key: string) => key.includes('blog-analytics'),
  ];
  
  for (const shouldClean of cleanupOrder) {
    const keysToClean = keys.filter(shouldClean);
    if (keysToClean.length > 0) {
      console.log(`🧹 Nettoyage prioritaire: ${keysToClean.length} clés`);
      keysToClean.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn(`Impossible de supprimer ${key}:`, e);
        }
      });
      
      // Vérifier si on a assez d'espace maintenant
      if (getAvailableSpace() > 1024 * 1024) { // 1MB libre
        break;
      }
    }
  }
};

export function useSecureStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Essayer localStorage d'abord
      const item = localStorage.getItem(key);
      if (item) {
        try {
          // Essayer de décompresser si nécessaire
          const decompressed = item.startsWith('COMPRESSED:') 
            ? decompress(item.substring(11))
            : item;
          return JSON.parse(decompressed);
        } catch (parseError) {
          console.warn(`Erreur de parsing pour ${key}, utilisation de la valeur par défaut`);
          return initialValue;
        }
      }
      
      // Fallback vers le cache mémoire
      if (memoryCache.has(key)) {
        console.log(`📱 Récupération depuis le cache mémoire: ${key}`);
        return memoryCache.get(key);
      }
      
      return initialValue;
    } catch (error) {
      console.error(`Erreur lors du chargement de ${key}:`, error);
      return memoryCache.get(key) || initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      const serializedValue = JSON.stringify(valueToStore);
      let finalValue = serializedValue;
      
      // Compression si la valeur est grande
      if (serializedValue.length > STORAGE_CONFIG.compressionThreshold) {
        const compressed = compress(serializedValue);
        if (compressed.length < serializedValue.length * 0.8) {
          finalValue = 'COMPRESSED:' + compressed;
          console.log(`🗜️ Compression de ${key}: ${serializedValue.length} → ${compressed.length} bytes`);
        }
      }
      
      // Tentative de stockage avec retry
      let retries = 0;
      const attemptStorage = () => {
        try {
          localStorage.setItem(key, finalValue);
          
          // Succès - supprimer du cache mémoire si présent
          if (memoryCache.has(key)) {
            memoryCache.delete(key);
          }
          
          return true;
        } catch (error) {
          if (error instanceof DOMException && error.code === 22) {
            // QuotaExceededError
            console.warn(`⚠️ Quota dépassé pour ${key}, tentative ${retries + 1}/${STORAGE_CONFIG.maxRetries}`);
            
            if (retries < STORAGE_CONFIG.maxRetries) {
              cleanupByPriority();
              retries++;
              return attemptStorage(); // Retry récursif
            } else {
              // Fallback vers le cache mémoire
              if (STORAGE_CONFIG.fallbackToMemory) {
                console.log(`📱 Fallback vers cache mémoire pour ${key}`);
                memoryCache.set(key, valueToStore);
                return true;
              }
              throw error;
            }
          } else {
            throw error;
          }
        }
      };
      
      attemptStorage();
      
    } catch (error) {
      console.error(`❌ Impossible de sauvegarder ${key}:`, error);
      
      // Fallback ultime vers le cache mémoire
      if (STORAGE_CONFIG.fallbackToMemory) {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        memoryCache.set(key, valueToStore);
        console.log(`📱 Sauvegarde d'urgence en mémoire pour ${key}`);
      }
    }
  }, [key, storedValue]);

  // Fonction pour forcer la synchronisation
  const forceSync = useCallback(() => {
    if (memoryCache.has(key)) {
      const memoryValue = memoryCache.get(key);
      try {
        localStorage.setItem(key, JSON.stringify(memoryValue));
        memoryCache.delete(key);
        console.log(`✅ Synchronisation réussie pour ${key}`);
        return true;
      } catch (error) {
        console.warn(`❌ Impossible de synchroniser ${key}:`, error);
        return false;
      }
    }
    return true;
  }, [key]);

  // Fonction pour vérifier l'état du stockage
  const getStorageInfo = useCallback(() => {
    const inLocalStorage = localStorage.getItem(key) !== null;
    const inMemoryCache = memoryCache.has(key);
    const storageSize = getStorageSize();
    const availableSpace = getAvailableSpace();
    
    return {
      key,
      inLocalStorage,
      inMemoryCache,
      storageSize: Math.round(storageSize / 1024) + 'KB',
      availableSpace: Math.round(availableSpace / 1024) + 'KB',
      quotaUsage: Math.round((storageSize / (5 * 1024 * 1024)) * 100) + '%'
    };
  }, [key]);

  // Nettoyage automatique si nécessaire
  useEffect(() => {
    const checkQuota = () => {
      const usage = getStorageSize() / (5 * 1024 * 1024);
      if (usage > STORAGE_CONFIG.quotaWarningThreshold) {
        console.warn(`⚠️ Quota localStorage à ${Math.round(usage * 100)}%`);
        if (usage > 0.95) {
          console.log('🧹 Nettoyage d\'urgence déclenché');
          cleanupByPriority();
        }
      }
    };
    
    checkQuota();
  }, [storedValue]);

  return [
    storedValue, 
    setValue,
    {
      forceSync,
      getStorageInfo,
      isInMemory: memoryCache.has(key),
      cleanup: () => cleanupByPriority()
    }
  ] as const;
}