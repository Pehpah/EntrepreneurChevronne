// Stratégie de stockage adaptative

export type StorageType = 'localStorage' | 'sessionStorage' | 'indexedDB' | 'memory' | 'server';

export interface StorageStrategy {
  type: StorageType;
  available: boolean;
  capacity: number; // en MB
  persistent: boolean;
  description: string;
}

// Détection des capacités de stockage
export const detectStorageCapabilities = (): StorageStrategy[] => {
  const strategies: StorageStrategy[] = [];

  // 1. localStorage
  try {
    const testKey = 'storage-test';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    strategies.push({
      type: 'localStorage',
      available: true,
      capacity: 5, // ~5MB
      persistent: true,
      description: 'Stockage local persistant (5-10MB)'
    });
  } catch (e) {
    strategies.push({
      type: 'localStorage',
      available: false,
      capacity: 0,
      persistent: true,
      description: 'localStorage indisponible'
    });
  }

  // 2. sessionStorage
  try {
    const testKey = 'session-test';
    sessionStorage.setItem(testKey, 'test');
    sessionStorage.removeItem(testKey);
    strategies.push({
      type: 'sessionStorage',
      available: true,
      capacity: 5, // ~5MB
      persistent: false,
      description: 'Stockage de session (5-10MB, temporaire)'
    });
  } catch (e) {
    strategies.push({
      type: 'sessionStorage',
      available: false,
      capacity: 0,
      persistent: false,
      description: 'sessionStorage indisponible'
    });
  }

  // 3. IndexedDB
  strategies.push({
    type: 'indexedDB',
    available: 'indexedDB' in window,
    capacity: 50, // ~50MB+
    persistent: true,
    description: 'Base de données navigateur (50MB+)'
  });

  // 4. Mémoire (toujours disponible)
  strategies.push({
    type: 'memory',
    available: true,
    capacity: 100, // Limité par la RAM
    persistent: false,
    description: 'Cache mémoire (temporaire)'
  });

  // 5. Serveur (si API disponible)
  strategies.push({
    type: 'server',
    available: false, // À implémenter
    capacity: 1000, // Illimité
    persistent: true,
    description: 'Stockage serveur (API requise)'
  });

  return strategies;
};

// Recommandations par type de données
export const getStorageRecommendation = (dataType: string, dataSize: number): StorageType => {
  const strategies = detectStorageCapabilities();
  
  switch (dataType) {
    case 'analytics':
      // Analytics: beaucoup de données, peut être temporaire
      if (strategies.find(s => s.type === 'indexedDB' && s.available)) {
        return 'indexedDB';
      }
      return 'memory'; // Fallback vers mémoire
      
    case 'user-settings':
      // Paramètres: petites données, persistantes
      if (strategies.find(s => s.type === 'localStorage' && s.available)) {
        return 'localStorage';
      }
      return 'sessionStorage';
      
    case 'session-data':
      // Données de session: temporaires
      return 'sessionStorage';
      
    case 'cache':
      // Cache: temporaire, peut être volumineux
      if (dataSize > 1024 * 1024) { // > 1MB
        return 'indexedDB';
      }
      return 'memory';
      
    default:
      return 'localStorage';
  }
};

// Implémentation IndexedDB pour les analytics
export class IndexedDBStorage {
  private dbName = 'BlogAnalytics';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => {
        console.error('Erreur IndexedDB:', request.error);
        resolve(false);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ IndexedDB initialisé');
        resolve(true);
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        
        // Store pour les pageviews
        if (!db.objectStoreNames.contains('pageviews')) {
          const pageviewsStore = db.createObjectStore('pageviews', { keyPath: 'id' });
          pageviewsStore.createIndex('timestamp', 'timestamp');
          pageviewsStore.createIndex('path', 'path');
        }
        
        // Store pour les events
        if (!db.objectStoreNames.contains('events')) {
          const eventsStore = db.createObjectStore('events', { keyPath: 'id' });
          eventsStore.createIndex('timestamp', 'timestamp');
          eventsStore.createIndex('type', 'type');
        }
        
        // Store pour les sessions
        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore('sessions', { keyPath: 'id' });
        }
      };
    });
  }

  async addPageView(pageView: any): Promise<boolean> {
    if (!this.db) return false;
    
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['pageviews'], 'readwrite');
      const store = transaction.objectStore('pageviews');
      const request = store.add(pageView);
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => {
        console.error('Erreur ajout pageview:', request.error);
        resolve(false);
      };
    });
  }

  async getRecentPageViews(limit: number = 500): Promise<any[]> {
    if (!this.db) return [];
    
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['pageviews'], 'readonly');
      const store = transaction.objectStore('pageviews');
      const index = store.index('timestamp');
      const request = index.openCursor(null, 'prev'); // Plus récents en premier
      
      const results: any[] = [];
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor && results.length < limit) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      
      request.onerror = () => {
        console.error('Erreur lecture pageviews:', request.error);
        resolve([]);
      };
    });
  }

  async cleanup(olderThanDays: number = 30): Promise<void> {
    if (!this.db) return;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    const cutoffTimestamp = cutoffDate.toISOString();
    
    const stores = ['pageviews', 'events', 'sessions'];
    
    for (const storeName of stores) {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const index = store.index('timestamp');
      const range = IDBKeyRange.upperBound(cutoffTimestamp);
      
      const request = index.openCursor(range);
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
    }
    
    console.log(`🧹 Nettoyage IndexedDB: données > ${olderThanDays} jours supprimées`);
  }
}

// Configuration recommandée par environnement
export const getEnvironmentConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isLocalhost = window.location.hostname === 'localhost';
  
  if (isProduction && !isLocalhost) {
    return {
      analytics: 'server', // API backend
      userSettings: 'localStorage',
      cache: 'indexedDB',
      session: 'sessionStorage'
    };
  } else {
    return {
      analytics: 'indexedDB', // Développement
      userSettings: 'localStorage',
      cache: 'memory',
      session: 'sessionStorage'
    };
  }
};

// Migration des données localStorage vers IndexedDB
export const migrateToIndexedDB = async (): Promise<boolean> => {
  try {
    const idbStorage = new IndexedDBStorage();
    const initialized = await idbStorage.init();
    
    if (!initialized) {
      console.warn('Impossible d\'initialiser IndexedDB');
      return false;
    }
    
    // Migrer les pageviews
    const pageviewsData = localStorage.getItem('analytics-pageviews');
    if (pageviewsData) {
      const pageviews = JSON.parse(pageviewsData);
      console.log(`📦 Migration de ${pageviews.length} pageviews vers IndexedDB`);
      
      for (const pageview of pageviews) {
        await idbStorage.addPageView(pageview);
      }
      
      // Supprimer de localStorage après migration
      localStorage.removeItem('analytics-pageviews');
    }
    
    console.log('✅ Migration vers IndexedDB terminée');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    return false;
  }
};