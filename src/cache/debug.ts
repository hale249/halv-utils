import { Cache, SetCacheOptions } from '../types';

export class Debug implements Cache {
  private logger: any;

  constructor(logger: any) {
    this.logger = logger;
  }

  isReady(): Promise<void> {
    return Promise.resolve();
  }

  del(key: string): void {
    this.logger.debug(`[Cache][Del] key ${key}`);
  }

  get(key: string): Promise<string> {
    this.logger.debug(`[Cache][Get] key ${key}`);
    return Promise.resolve('');
  }

  set(key: string, val: string, ttl?: number, options?: SetCacheOptions): void {
    this.logger.debug(`[Cache][Set] Key ${key}, ttl: ${ttl}`);
  }

  expire(key: string, ttl: number): void {
    this.logger.debug(`[Cache][Expire] Key ${key}, ttl: ${ttl}`);
  }

  hget(key: string, field: string): Promise<string> {
    this.logger.debug(`[Cache][HGET] Key ${key}, field: ${field}`);
    return Promise.resolve('');
  }

  hset(key: string, field: string, value: string): void {
    this.logger.debug(`[Cache][HSET] Key ${key}, field: ${field}`);
  }

  hdel(key: string, field: string): void {
    this.logger.debug(`[Cache][HDel] key ${key}, field: ${field}`);
  }
}
