import UniversalCookie from 'universal-cookie';
import type { Storage, StorageChangeListener, StorageGetOptions, StorageSetOptions } from '../types';
import { parseStorageValue } from '../parse';

export interface CookieParseOptions {
  decode: (value: string) => string;
}

/**
 * Create cookie instance
 * @param cookies
 * @param options
 */
export function createCookie(cookies?: any, options?: CookieParseOptions): Storage {
  const cookie = new UniversalCookie(cookies, options);

  return {
    get(key: string, options?: StorageGetOptions): any {
      let value = cookie.get(key, options);
      if (!options || !options.doNotParse || typeof value === 'string') {
        value = parseStorageValue(value);
      }

      return typeof value !== 'undefined' ? value : null;
    },
    remove(key: string): void {
      return cookie.remove(key);
    },
    set(key: string, value: any, options?: StorageSetOptions): void {
      return cookie.set(key, value, options);
    },
    addChangeListener(callback: StorageChangeListener): void {
      cookie.addChangeListener(callback);
    },
  };
}
