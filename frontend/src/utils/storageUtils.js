// Storage utilities for localStorage, sessionStorage, and cookies
class StorageManager {
  constructor(storage) {
    this.storage = storage;
  }

  set(key, value, options = {}) {
    try {
      const data = {
        value,
        timestamp: Date.now(),
        expires: options.expires ? Date.now() + options.expires : null
      };
      
      this.storage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  }

  get(key, defaultValue = null) {
    try {
      const item = this.storage.getItem(key);
      if (!item) return defaultValue;
      
      const data = JSON.parse(item);
      
      // Check expiration
      if (data.expires && Date.now() > data.expires) {
        this.remove(key);
        return defaultValue;
      }
      
      return data.value;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  }

  remove(key) {
    try {
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  }

  clear() {
    try {
      this.storage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  has(key) {
    return this.storage.getItem(key) !== null;
  }

  keys() {
    try {
      return Object.keys(this.storage);
    } catch (error) {
      console.error('Storage keys error:', error);
      return [];
    }
  }

  size() {
    try {
      return this.storage.length;
    } catch (error) {
      console.error('Storage size error:', error);
      return 0;
    }
  }

  getAll() {
    try {
      const items = {};
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        items[key] = this.get(key);
      }
      return items;
    } catch (error) {
      console.error('Storage getAll error:', error);
      return {};
    }
  }

  setMultiple(items) {
    const results = {};
    for (const [key, value] of Object.entries(items)) {
      results[key] = this.set(key, value);
    }
    return results;
  }

  removeMultiple(keys) {
    const results = {};
    for (const key of keys) {
      results[key] = this.remove(key);
    }
    return results;
  }

  // Get items by prefix
  getByPrefix(prefix) {
    const items = {};
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key.startsWith(prefix)) {
        items[key] = this.get(key);
      }
    }
    return items;
  }

  // Remove items by prefix
  removeByPrefix(prefix) {
    const keysToRemove = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    return this.removeMultiple(keysToRemove);
  }
}

// Create instances
export const localStorage = new StorageManager(window.localStorage);
export const sessionStorage = new StorageManager(window.sessionStorage);

// Cookie utilities
export const cookies = {
  set(name, value, options = {}) {
    try {
      const {
        expires,
        maxAge,
        domain,
        path = '/',
        secure = false,
        sameSite = 'Lax'
      } = options;

      let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(JSON.stringify(value))}`;
      
      if (expires) {
        const expiresDate = expires instanceof Date ? expires : new Date(Date.now() + expires);
        cookieString += `; expires=${expiresDate.toUTCString()}`;
      }
      
      if (maxAge) {
        cookieString += `; max-age=${maxAge}`;
      }
      
      if (domain) {
        cookieString += `; domain=${domain}`;
      }
      
      cookieString += `; path=${path}`;
      
      if (secure) {
        cookieString += '; secure';
      }
      
      cookieString += `; samesite=${sameSite}`;
      
      document.cookie = cookieString;
      return true;
    } catch (error) {
      console.error('Cookie set error:', error);
      return false;
    }
  },

  get(name, defaultValue = null) {
    try {
      const cookies = document.cookie.split(';');
      
      for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        
        if (decodeURIComponent(cookieName) === name) {
          return JSON.parse(decodeURIComponent(cookieValue));
        }
      }
      
      return defaultValue;
    } catch (error) {
      console.error('Cookie get error:', error);
      return defaultValue;
    }
  },

  remove(name, options = {}) {
    return this.set(name, '', {
      ...options,
      expires: new Date(0)
    });
  },

  has(name) {
    return this.get(name) !== null;
  },

  getAll() {
    try {
      const cookies = {};
      const cookieArray = document.cookie.split(';');
      
      for (let cookie of cookieArray) {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
          cookies[decodeURIComponent(name)] = JSON.parse(decodeURIComponent(value));
        }
      }
      
      return cookies;
    } catch (error) {
      console.error('Cookie getAll error:', error);
      return {};
    }
  },

  clear(options = {}) {
    const allCookies = this.getAll();
    const results = {};
    
    for (const name of Object.keys(allCookies)) {
      results[name] = this.remove(name, options);
    }
    
    return results;
  }
};

// Storage detection
export const isStorageAvailable = (type = 'localStorage') => {
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, 'test');
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

// Fallback storage for when localStorage/sessionStorage is not available
class FallbackStorage {
  constructor() {
    this.data = new Map();
  }

  setItem(key, value) {
    this.data.set(key, value);
  }

  getItem(key) {
    return this.data.get(key) || null;
  }

  removeItem(key) {
    this.data.delete(key);
  }

  clear() {
    this.data.clear();
  }

  get length() {
    return this.data.size;
  }

  key(index) {
    return Array.from(this.data.keys())[index] || null;
  }
}

// Create fallback storages
const fallbackLocalStorage = new FallbackStorage();
const fallbackSessionStorage = new FallbackStorage();

// Safe storage that falls back to memory storage
export const safeLocalStorage = new StorageManager(
  isStorageAvailable('localStorage') ? window.localStorage : fallbackLocalStorage
);

export const safeSessionStorage = new StorageManager(
  isStorageAvailable('sessionStorage') ? window.sessionStorage : fallbackSessionStorage
);

// Storage utilities
export const storageUtils = {
  // Migrate data between storage types
  migrate(fromStorage, toStorage, keys = null) {
    try {
      const keysToMigrate = keys || fromStorage.keys();
      const results = {};
      
      for (const key of keysToMigrate) {
        const value = fromStorage.get(key);
        if (value !== null) {
          results[key] = toStorage.set(key, value);
          fromStorage.remove(key);
        }
      }
      
      return results;
    } catch (error) {
      console.error('Storage migration error:', error);
      return {};
    }
  },

  // Backup storage to JSON
  backup(storage, keys = null) {
    try {
      const keysToBackup = keys || storage.keys();
      const backup = {};
      
      for (const key of keysToBackup) {
        const value = storage.get(key);
        if (value !== null) {
          backup[key] = value;
        }
      }
      
      return {
        timestamp: Date.now(),
        data: backup
      };
    } catch (error) {
      console.error('Storage backup error:', error);
      return null;
    }
  },

  // Restore storage from backup
  restore(storage, backup, merge = false) {
    try {
      if (!backup || !backup.data) return false;
      
      if (!merge) {
        storage.clear();
      }
      
      const results = storage.setMultiple(backup.data);
      
      return Object.values(results).every(result => result);
    } catch (error) {
      console.error('Storage restore error:', error);
      return false;
    }
  },

  // Get storage usage info
  getStorageInfo(storage) {
    try {
      const keys = storage.keys();
      const items = storage.getAll();
      
      let totalSize = 0;
      const itemSizes = {};
      
      for (const key of keys) {
        const itemString = JSON.stringify(items[key]);
        const itemSize = new Blob([itemString]).size;
        itemSizes[key] = itemSize;
        totalSize += itemSize;
      }
      
      return {
        totalItems: keys.length,
        totalSize,
        itemSizes,
        averageSize: keys.length > 0 ? totalSize / keys.length : 0
      };
    } catch (error) {
      console.error('Storage info error:', error);
      return null;
    }
  },

  // Compress data before storage
  compress(data) {
    try {
      // Simple compression by removing whitespace from JSON
      return JSON.stringify(data).replace(/\s/g, '');
    } catch (error) {
      console.error('Compression error:', error);
      return JSON.stringify(data);
    }
  },

  // Decompress data after retrieval
  decompress(compressedData) {
    try {
      return JSON.parse(compressedData);
    } catch (error) {
      console.error('Decompression error:', error);
      return compressedData;
    }
  }
};

// Cache implementation with TTL support
export class Cache {
  constructor(storage = safeLocalStorage, prefix = 'cache_') {
    this.storage = storage;
    this.prefix = prefix;
  }

  set(key, value, ttl = 3600000) { // Default 1 hour TTL
    return this.storage.set(`${this.prefix}${key}`, value, { expires: ttl });
  }

  get(key, defaultValue = null) {
    return this.storage.get(`${this.prefix}${key}`, defaultValue);
  }

  remove(key) {
    return this.storage.remove(`${this.prefix}${key}`);
  }

  clear() {
    return this.storage.removeByPrefix(this.prefix);
  }

  has(key) {
    return this.storage.has(`${this.prefix}${key}`);
  }

  keys() {
    return this.storage.keys()
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.substring(this.prefix.length));
  }

  getAll() {
    const items = this.storage.getByPrefix(this.prefix);
    const result = {};
    
    for (const [key, value] of Object.entries(items)) {
      result[key.substring(this.prefix.length)] = value;
    }
    
    return result;
  }

  // Get or set pattern
  getOrSet(key, factory, ttl = 3600000) {
    if (this.has(key)) {
      return this.get(key);
    }
    
    const value = typeof factory === 'function' ? factory() : factory;
    this.set(key, value, ttl);
    return value;
  }
}

// Default cache instances
export const memoryCache = new Cache(safeSessionStorage, 'memory_');
export const persistentCache = new Cache(safeLocalStorage, 'persistent_');

// Export all utilities
export default {
  localStorage,
  sessionStorage,
  cookies,
  safeLocalStorage,
  safeSessionStorage,
  isStorageAvailable,
  storageUtils,
  Cache,
  memoryCache,
  persistentCache
};