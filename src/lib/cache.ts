// Simple IndexedDB cache utility
class CacheManager {
  private dbName = 'afri-fek-cache';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('resources')) {
          db.createObjectStore('resources', { keyPath: 'key' });
        }
      };
    });
  }

  async set(key: string, data: any, ttl: number = 600000): Promise<void> { // 10 min default
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['resources'], 'readwrite');
    const store = transaction.objectStore('resources');
    
    await store.put({
      key,
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  async get(key: string): Promise<any | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['resources'], 'readonly');
      const store = transaction.objectStore('resources');
      const request = store.get(key);
      
      request.onsuccess = () => {
        const result = request.result;
        if (!result) {
          resolve(null);
          return;
        }
        
        // Check if expired
        if (Date.now() - result.timestamp > result.ttl) {
          this.delete(key);
          resolve(null);
          return;
        }
        
        resolve(result.data);
      };
      
      request.onerror = () => resolve(null);
    });
  }

  async delete(key: string): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['resources'], 'readwrite');
    const store = transaction.objectStore('resources');
    await store.delete(key);
  }

  async needsRefresh(key: string, softTtl: number = 300000): Promise<boolean> { // 5 min soft refresh
    if (!this.db) await this.init();
    
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['resources'], 'readonly');
      const store = transaction.objectStore('resources');
      const request = store.get(key);
      
      request.onsuccess = () => {
        const result = request.result;
        if (!result) {
          resolve(true);
          return;
        }
        
        // Check if needs soft refresh (background update)
        resolve(Date.now() - result.timestamp > softTtl);
      };
      
      request.onerror = () => resolve(true);
    });
  }
}

export const cache = new CacheManager();