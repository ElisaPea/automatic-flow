import type { CacheProvider } from './cache.provider';

/** Caché desactivada (CACHE_DRIVER=none). */
export class NullCache implements CacheProvider {
  readonly name = 'none';
  async get<T>(): Promise<T | null> {
    return null;
  }
  async set(): Promise<void> {}
  async del(): Promise<void> {}
  async incr(): Promise<number> {
    return 0;
  }
}
