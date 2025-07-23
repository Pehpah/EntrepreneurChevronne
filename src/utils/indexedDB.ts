// IndexedDB utility to replace localStorage
const DB_NAME = 'EntrepreneurChevronneDB';
const DB_VERSION = 1;

// Store names
export const STORES = {
  ANALYTICS_EVENTS: 'analytics-events',
  ANALYTICS_PAGEVIEWS: 'analytics-pageviews',
  ANALYTICS_SESSIONS: 'analytics-sessions',
  CURRENT_SESSION: 'current-session',
  SITE_CONFIG: 'site-config',
  COMMENTS: 'comments',
  NEWSLETTER: 'newsletter',
  ADVERTISEMENTS: 'advertisements',
  AD_STATS: 'ad-stats',
  THEME: 'theme',
  AUTH_SESSION: 'auth-session',
  LOGIN_ATTEMPTS: 'login-attempts'
} as const;

class IndexedDBManager {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB opening failed:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        Object.values(STORES).forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
            store.createIndex('key', 'key', { unique: true });
            console.log(`📦 Created store: ${storeName}`);
          }
        });
      };
    });

    return this.initPromise;
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('Failed to initialize IndexedDB');
    }
    return this.db;
  }

  async setItem<T>(storeName: string, key: string, value: T): Promise<void> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      // Check if item exists
      const existingRequest = store.index('key').get(key);
      
      return new Promise((resolve, reject) => {
        existingRequest.onsuccess = () => {
          const existing = existingRequest.result;
          
          if (existing) {
            // Update existing item
            const updateRequest = store.put({
              id: existing.id,
              key,
              value: JSON.stringify(value),
              timestamp: Date.now()
            });
            
            updateRequest.onsuccess = () => resolve();
            updateRequest.onerror = () => reject(updateRequest.error);
          } else {
            // Add new item
            const addRequest = store.add({
              key,
              value: JSON.stringify(value),
              timestamp: Date.now()
            });
            
            addRequest.onsuccess = () => resolve();
            addRequest.onerror = () => reject(addRequest.error);
          }
        };
        
        existingRequest.onerror = () => reject(existingRequest.error);
      });
    } catch (error) {
      console.error(`Error setting IndexedDB item ${key}:`, error);
      throw error;
    }
  }

  async getItem<T>(storeName: string, key: string, defaultValue?: T): Promise<T | null> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.index('key').get(key);
      
      return new Promise((resolve) => {
        request.onsuccess = () => {
          const result = request.result;
          if (result && result.value) {
            try {
              const parsed = JSON.parse(result.value);
              resolve(parsed);
            } catch (error) {
              console.error(`Error parsing IndexedDB value for ${key}:`, error);
              resolve(defaultValue || null);
            }
          } else {
            resolve(defaultValue || null);
          }
        };
        
        request.onerror = () => {
          console.error(`Error getting IndexedDB item ${key}:`, request.error);
          resolve(defaultValue || null);
        };
      });
    } catch (error) {
      console.error(`Error accessing IndexedDB for ${key}:`, error);
      return defaultValue || null;
    }
  }

  async removeItem(storeName: string, key: string): Promise<void> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const index = store.index('key');
      const getRequest = index.get(key);
      
      return new Promise((resolve, reject) => {
        getRequest.onsuccess = () => {
          const result = getRequest.result;
          if (result) {
            const deleteRequest = store.delete(result.id);
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
          } else {
            resolve(); // Item doesn't exist, consider it removed
          }
        };
        
        getRequest.onerror = () => reject(getRequest.error);
      });
    } catch (error) {
      console.error(`Error removing IndexedDB item ${key}:`, error);
      throw error;
    }
  }

  async clear(storeName: string): Promise<void> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log(`🧹 Cleared IndexedDB store: ${storeName}`);
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`Error clearing IndexedDB store ${storeName}:`, error);
      throw error;
    }
  }

  async getAllKeys(storeName: string): Promise<string[]> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const results = request.result || [];
          const keys = results.map(item => item.key);
          resolve(keys);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`Error getting all keys from ${storeName}:`, error);
      return [];
    }
  }

  async getStorageSize(storeName: string): Promise<number> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const results = request.result || [];
          let totalSize = 0;
          results.forEach(item => {
            totalSize += (item.key?.length || 0) + (item.value?.length || 0);
          });
          resolve(totalSize);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`Error calculating storage size for ${storeName}:`, error);
      return 0;
    }
  }

  // Migration utility from localStorage
  async migrateFromLocalStorage(): Promise<void> {
    console.log('🔄 Starting migration from localStorage to IndexedDB...');
    
    const migrations = [
      { localKey: 'analytics-events', store: STORES.ANALYTICS_EVENTS },
      { localKey: 'analytics-pageviews', store: STORES.ANALYTICS_PAGEVIEWS },
      { localKey: 'analytics-sessions', store: STORES.ANALYTICS_SESSIONS },
      { localKey: 'current-session', store: STORES.CURRENT_SESSION },
      { localKey: 'blog-site-config', store: STORES.SITE_CONFIG },
      { localKey: 'blog-comments', store: STORES.COMMENTS },
      { localKey: 'newsletter-subscribers', store: STORES.NEWSLETTER },
      { localKey: 'blog-advertisements', store: STORES.ADVERTISEMENTS },
      { localKey: 'ad-stats', store: STORES.AD_STATS },
      { localKey: 'blog-theme', store: STORES.THEME },
    ];

    for (const { localKey, store } of migrations) {
      try {
        const localData = localStorage.getItem(localKey);
        if (localData) {
          const parsed = JSON.parse(localData);
          await this.setItem(store, localKey, parsed);
          console.log(`✅ Migrated ${localKey} to IndexedDB`);
          
          // Remove from localStorage after successful migration
          localStorage.removeItem(localKey);
        }
      } catch (error) {
        console.error(`❌ Failed to migrate ${localKey}:`, error);
      }
    }

    console.log('✅ Migration from localStorage to IndexedDB completed');
  }
}

// Singleton instance
export const indexedDB = new IndexedDBManager();

// Initialize on import
indexedDB.init().catch(error => {
  console.error('Failed to initialize IndexedDB:', error);
});