export type SetCacheOptions = {
  type: string;
};

export interface Cache {
  isReady(): Promise<void>;

  get(key: string): Promise<string>;
  hget(key: string, field: string): Promise<string>;

  set(key: string, value: string, ttl?: number, options?: SetCacheOptions): void;
  hset(key: string, field: string, value: string, ttl?: number, options?: SetCacheOptions): void;
  expire(key: string, ttl: number): void;

  del(key: string): void;
  hdel(key: string, field: string): void;
}
