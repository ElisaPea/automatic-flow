import type { CacheProvider } from './cache.provider';

interface Entry {
  value: unknown;
  expiresAt: number;
}

/** LRU en memoria. Por instancia: en serverless no se comparte entre funciones. */
export class MemoryCache implements CacheProvider {
  readonly name = 'memory';
  private readonly store = new Map<string, Entry>();

  constructor(private readonly maxEntries: number) {}

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }
    this.store.delete(key);
    this.store.set(key, entry); // refresca posición LRU
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    this.store.delete(key);
    this.store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
    this.evict();
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async incr(key: string, ttlSeconds: number): Promise<number> {
    const current = (await this.get<number>(key)) ?? 0;
    const entry = this.store.get(key);
    const next = current + 1;
    const expiresAt = entry?.expiresAt ?? Date.now() + ttlSeconds * 1000;
    this.store.set(key, { value: next, expiresAt });
    return next;
  }

  private evict(): void {
    while (this.store.size > this.maxEntries) {
      const oldest = this.store.keys().next().value;
      if (oldest === undefined) return;
      this.store.delete(oldest);
    }
  }
}
