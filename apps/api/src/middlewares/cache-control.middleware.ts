import type { RequestHandler } from 'express';

export interface CacheControlOptions {
  /** Segundos que la CDN (Vercel Edge / Cloudflare...) puede servir la respuesta. */
  sMaxAge: number;
  /** Segundos en los que la CDN puede servir contenido caducado mientras revalida. */
  staleWhileRevalidate?: number;
}

/** Para endpoints PÚBLICOS de lectura: delega el cacheo a la CDN. */
export const publicCache =
  ({ sMaxAge, staleWhileRevalidate = sMaxAge * 5 }: CacheControlOptions): RequestHandler =>
  (_req, res, next) => {
    res.setHeader(
      'Cache-Control',
      `public, max-age=0, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
    );
    next();
  };

/** Para endpoints privados (con usuario): nunca cachear en intermediarios. */
export const noStore: RequestHandler = (_req, res, next) => {
  res.setHeader('Cache-Control', 'private, no-store');
  next();
};
