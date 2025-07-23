// Simple storage utility that prefers IndexedDB but falls back to localStorage
const DB_NAME = 'EntrepreneurChevronneDB';
const DB_VERSION = 1;
const STORE_NAME = 'keyvalue';

let db: IDBDatabase | null = null;
let initPromise: Promise<void> | null = null;

// Initialize IndexedDB
async function initDB(): Promise<void> {
  if (initPromise) {
    return initPromise;
  }

  initPromise = new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.warn('IndexedDB failed, will use localStorage fallback');
        resolve(); // Don't reject, just resolve without DB
      };

      request.onsuccess = () => {
        db = request.result;
        console.log('✅ IndexedDB initialized');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const database = (event.target as IDBOpenDBRequest).result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };
    } catch (error) {
      console.warn('IndexedDB not available, using localStorage fallback');
      resolve(); // Don't reject, just resolve without DB
    }
  });

  return initPromise;
}

// Storage functions
export const storage = {
  async setItem<T>(key: string, value: T): Promise<void> {
    await initDB();
    
    if (db) {
      try {
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
        return;
      } catch (error) {
        console.warn('IndexedDB write failed, falling back to localStorage:', error);
      }
    }
    
    // Fallback to localStorage
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Both IndexedDB and localStorage failed:', error);
    }
  },

  async getItem<T>(key: string, defaultValue?: T): Promise<T | null> {
    await initDB();
    
    if (db) {
      try {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        
        const result = await new Promise<any>((resolve, reject) => {
          const request = store.get(key);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        
        if (result && result.value) {
          return JSON.parse(result.value);
        }
      } catch (error) {
        console.warn('IndexedDB read failed, falling back to localStorage:', error);
      }
    }
    
    // Fallback to localStorage
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : (defaultValue || null);
    } catch (error) {
      console.error('Both IndexedDB and localStorage failed:', error);
      return defaultValue || null;
    }
  },

  async removeItem(key: string): Promise<void> {
    await initDB();
    
    if (db) {
      try {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        await new Promise<void>((resolve, reject) => {
          const request = store.delete(key);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } catch (error) {
        console.warn('IndexedDB delete failed, falling back to localStorage:', error);
      }
    }
    
    // Fallback to localStorage
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Both IndexedDB and localStorage failed:', error);
    }
  },

  async clear(): Promise<void> {
    await initDB();
    
    if (db) {
      try {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        await new Promise<void>((resolve, reject) => {
          const request = store.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } catch (error) {
        console.warn('IndexedDB clear failed, falling back to localStorage:', error);
      }
    }
    
    // Fallback to localStorage
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Both IndexedDB and localStorage failed:', error);
    }
  },

  // Migration from localStorage to IndexedDB
  async migrate(): Promise<void> {
    console.log('🔄 Migrating from localStorage to IndexedDB...');
    
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
          localStorage.removeItem(key); // Remove after successful migration
          console.log(`✅ Migrated ${key}`);
        }
      } catch (error) {
        console.error(`❌ Failed to migrate ${key}:`, error);
      }
    }

    console.log('✅ Migration completed');
  }
};

// Initialize on module load
initDB().catch(console.error);