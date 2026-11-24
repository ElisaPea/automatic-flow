import { Token } from 'typedi';

/**
 * Contrato de caché. Cualquier implementación (memoria, Upstash, Redis TCP, etc.)
 * debe cumplirlo; los servicios solo dependen de esta interfaz vía el token CACHE.
 */
export interface CacheProvider {
  readonly name: string;
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
  del(key: string): Promise<void>;
  /** Incremento atómico con TTL (rate limiting, contadores). */
  incr(key: string, ttlSeconds: number): Promise<number>;
}

export const CACHE = new Token<CacheProvider>('cache');
