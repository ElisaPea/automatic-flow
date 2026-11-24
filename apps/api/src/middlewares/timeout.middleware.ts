import type { RequestHandler } from 'express';
import { timeout as timeoutError } from '../core/errors';
import { sendError } from '../core/http/send-error';

/**
 * Responde 504 controlado antes de que la plataforma (p.ej. Vercel) mate la función
 * y devuelva un error genérico. Debe ser menor que el maxDuration de la función.
 */
export const requestTimeout =
  (ms: number): RequestHandler =>
  (_req, res, next) => {
    const timer = setTimeout(() => sendError(res, timeoutError()), ms);
    const clear = () => clearTimeout(timer);
    res.on('finish', clear);
    res.on('close', clear);
    next();
  };
