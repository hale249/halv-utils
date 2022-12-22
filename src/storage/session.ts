import { Storage, StorageGetOptions, StorageSetOptions } from '../types';
import { parseStorageValue } from '../parse';

/**
 * Create session storage instance
 */
export function createSessionStorage(): Storage {
  // Check session storage available
  if (typeof sessionStorage === 'undefined') {
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
      return parseStorageValue(sessionStorage.getItem(key), options);
    },
    remove(key: string): void {
      sessionStorage.removeItem(key);
    },
    set(key: string, value: any): void {
      sessionStorage.setItem(key, value);
    },
  };
}
