import { CookieSetOptions, CookieGetOptions, CookieChangeListener, CookieChangeOptions } from 'universal-cookie';

export type StorageGetOptions = CookieGetOptions;
export type StorageSetOptions = CookieSetOptions;
export type StorageChangeListener = CookieChangeListener;
export type StorageChangeOptions = CookieChangeOptions;

export interface Storage {
  get(key: string, options?: StorageGetOptions): any;
  get<T>(key: string, options?: StorageGetOptions): T;
  set(key: string, value: any, options?: StorageSetOptions): void;
  remove(key: string): void;
  addChangeListener?(callback: StorageChangeListener): void;
}
