// Simple IndexedDB utility to replace localStorage
const DB_NAME = 'EntrepreneurChevronneDB';
const DB_VERSION = 1;
const STORE_NAME = 'keyvalue';

class SimpleIndexedDB {
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
        
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
          console.log('📦 Created IndexedDB store');
        }
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

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put({
          key,
          value: JSON.stringify(value),
          timestamp: Date.now()
        });
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`Error setting IndexedDB item ${key}:`, error);
      // Fallback to localStorage
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (localStorageError) {
        console.error('Fallback to localStorage also failed:', localStorageError);
      }
    }
  }

  async getItem<T>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
      const result = await new Promise<any>((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      if (result && result.value) {
        try {
          return JSON.parse(result.value);
        } catch (error) {
          console.error(`Error parsing IndexedDB value for ${key}:`, error);
          return defaultValue || null;
        }
      } else {
        return defaultValue || null;
      }
    } catch (error) {
      console.error(`Error accessing IndexedDB for ${key}:`, error);
      // Fallback to localStorage
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : (defaultValue || null);
      } catch (localStorageError) {
        console.error('Fallback to localStorage also failed:', localStorageError);
        return defaultValue || null;
      }
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      await new Promise<void>((resolve, reject) => {
        const request = store.delete(key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`Error removing IndexedDB item ${key}:`, error);
      // Fallback to localStorage
      try {
        localStorage.removeItem(key);
      } catch (localStorageError) {
        console.error('Fallback to localStorage also failed:', localStorageError);
      }
    }
  }

  async clear(): Promise<void> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      await new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => {
          console.log('🧹 Cleared IndexedDB');
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error clearing IndexedDB:', error);
      // Fallback to localStorage
      try {
        localStorage.clear();
      } catch (localStorageError) {
        console.error('Fallback to localStorage also failed:', localStorageError);
      }
    }
  }

  // Migration utility from localStorage
  async migrateFromLocalStorage(): Promise<void> {
    console.log('🔄 Starting migration from localStorage to IndexedDB...');
    
    const keysToMigrate = [
      'analytics-events',
      'analytics-pageviews', 
      'analytics-sessions',
      'current-session',
      'blog-site-config',
      'blog-comments',
      'newsletter-subscribers',
      'blog-advertisements',
      'ad-stats',
      'blog-theme',
      'auth-session',
      'login-attempts'
    ];

    for (const key of keysToMigrate) {
      try {
        const localData = localStorage.getItem(key);
        if (localData) {
          const parsed = JSON.parse(localData);
          await this.setItem(key, parsed);
          console.log(`✅ Migrated ${key} to IndexedDB`);
          
          // Remove from localStorage after successful migration
          localStorage.removeItem(key);
        }
      } catch (error) {
        console.error(`❌ Failed to migrate ${key}:`, error);
      }
    }

    console.log('✅ Migration from localStorage to IndexedDB completed');
  }
}

// Singleton instance
export const simpleIndexedDB = new SimpleIndexedDB();

// Initialize immediately
simpleIndexedDB.init().catch(error => {
  console.error('Failed to initialize IndexedDB:', error);
});