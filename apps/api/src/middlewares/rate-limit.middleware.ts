import type { RequestHandler } from 'express';
import type { CacheProvider } from '../core/cache';
import { rateLimited } from '../core/errors';
import { sendError } from '../core/http/send-error';

export interface RateLimitOptions {
  max: number;
  windowSeconds: number;
  prefix?: string;
}

/**
 * Ventana fija sobre el CacheProvider. Con CACHE_DRIVER=memory el límite es por instancia;
 * con upstash es global. Si la caché falla, incr devuelve 0 y se deja pasar (fail-open).
 */
export const rateLimit =
  (cache: CacheProvider, opts: RateLimitOptions): RequestHandler =>
  async (req, res, next) => {
    const window = Math.floor(Date.now() / 1000 / opts.windowSeconds);
    const key = `rl:${opts.prefix ?? 'global'}:${req.ip ?? 'unknown'}:${window}`;
    const count = await cache.incr(key, opts.windowSeconds);
    res.setHeader('RateLimit-Limit', String(opts.max));
    res.setHeader('RateLimit-Remaining', String(Math.max(0, opts.max - count)));
    if (count > opts.max) return sendError(res, rateLimited(opts.windowSeconds));
    next();
  };
