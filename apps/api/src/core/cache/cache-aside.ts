import type { CacheProvider } from './cache.provider';

/** Patrón cache-aside: lee de caché; si no está, carga, guarda y devuelve. */
export const cacheAside = async <T>(
  cache: CacheProvider,
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>,
): Promise<T> => {
  const hit = await cache.get<T>(key);
  if (hit !== null) return hit;
  const value = await loader();
  if (value !== null && value !== undefined) await cache.set(key, value, ttlSeconds);
  return value;
};
