import type { RequestHandler } from 'express';
import { logger } from '../core/logger/logger';

const SLOW_MS = 1000;

/** Log de acceso con duración. Las peticiones lentas se marcan como warn. */
export const requestLogger: RequestHandler = (req, res, next) => {
  const start = performance.now();
  res.on('finish', () => {
    const ms = Math.round(performance.now() - start);
    const level = res.statusCode >= 500 ? 'error' : ms > SLOW_MS ? 'warn' : 'info';
    logger[level](
      {
        requestId: res.locals.requestId,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        ms,
      },
      'request',
    );
  });
  next();
};
