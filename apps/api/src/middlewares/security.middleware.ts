import compression from 'compression';
import cors from 'cors';
import type { RequestHandler } from 'express';
import helmet from 'helmet';
import type { Env } from '../config/env';

/** Cabeceras de seguridad, CORS (con preflight cacheado) y compresión. */
export const securityAndPerf = (env: Env): RequestHandler[] => [
  helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }),
  cors({
    origin: env.CORS_ORIGINS.length > 0 ? env.CORS_ORIGINS : env.NODE_ENV !== 'production',
    credentials: true,
    maxAge: 86_400, // el navegador cachea el preflight 24h → menos OPTIONS
  }),
  compression({ threshold: 1024 }),
];
