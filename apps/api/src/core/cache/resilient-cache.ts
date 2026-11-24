import type { Logger } from '../logger/logger';
import type { CacheProvider } from './cache.provider';

/**
 * Decorador "fail-open": si la caché falla, se registra y se continúa sin ella.
 * Una caché caída NUNCA debe provocar un error al cliente.
 */
export class ResilientCache implements CacheProvider {
  constructor(
    private readonly inner: CacheProvider,
    private readonly logger: Logger,
  ) {}

  get name() {
    return this.inner.name;
  }

  get<T>(key: string) {
    return this.safe(() => this.inner.get<T>(key), null);
  }
  set<T>(key: string, value: T, ttl: number) {
    return this.safe(() => this.inner.set(key, value, ttl), undefined);
  }
  del(key: string) {
    return this.safe(() => this.inner.del(key), undefined);
  }
  incr(key: string, ttl: number) {
    return this.safe(() => this.inner.incr(key, ttl), 0);
  }

  private async safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      this.logger.warn({ err, cache: this.inner.name }, 'cache operation failed (fail-open)');
      return fallback;
    }
  }
}
