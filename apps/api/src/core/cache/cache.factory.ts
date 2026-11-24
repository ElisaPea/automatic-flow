import type { Env } from '../../config/env';
import type { Logger } from '../logger/logger';
import type { CacheProvider } from './cache.provider';
import { MemoryCache } from './memory-cache';
import { NullCache } from './null-cache';
import { ResilientCache } from './resilient-cache';
import { UpstashCache } from './upstash-cache';

const build = (env: Env): CacheProvider => {
  switch (env.CACHE_DRIVER) {
    case 'upstash':
      return new UpstashCache(env.UPSTASH_REDIS_REST_URL ?? '', env.UPSTASH_REDIS_REST_TOKEN ?? '');
    case 'none':
      return new NullCache();
    default:
      return new MemoryCache(env.CACHE_MEMORY_MAX_ENTRIES);
  }
};

export const createCache = (env: Env, logger: Logger): CacheProvider =>
  new ResilientCache(build(env), logger);
