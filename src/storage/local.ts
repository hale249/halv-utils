import { Storage, StorageGetOptions, StorageSetOptions } from '../types';
import { parseStorageValue } from '../parse';

/**
 * Get expire key
 * @param key
 */
const getExpireKey = (key: string): string => `${key}_ex`;

/**
 * Create local storage instance
 */
export function createLocalStorage(): Storage {
  // Check local storage available
  if (typeof localStorage === 'undefined') {
    const isDev = process.env.NODE_ENV !== 'production';

    return {
      get(key: string, options?: StorageGetOptions): any {
        if (isDev) {
          console.warn(`Get key: ${key}`);
        }
      },
      remove(key: string): void {
        if (isDev) {
          console.warn('Remove key', key);
        }
      },
      set(key: string, value: any, options?: StorageSetOptions): void {
        if (isDev) {
          console.warn(`Set key ${key}, value ${value}, options ${options}`);
        }
      },
    };
  }

  return {
    get(key: string, options?: StorageGetOptions): any {
      const value = parseStorageValue(localStorage.getItem(key), options);
      const expire = localStorage.getItem(getExpireKey(key));
      const current = new Date().getTime() / 1000;

      // Check expire
      if (expire && current > parseInt(expire)) {
        this.remove(key);
        this.remove(getExpireKey(key));
        return null;
      }

      return value;
    },
    remove(key: string): void {
      localStorage.removeItem(key);
      localStorage.removeItem(getExpireKey(key));
    },
    set(key: string, value: any, options?: StorageSetOptions): void {
      localStorage.setItem(key, value);

      if (options && options.expires) {
        const expire = (options.expires.getTime() / 1000).toString();
        localStorage.setItem(getExpireKey(key), expire);
      }
    },
  };
}
