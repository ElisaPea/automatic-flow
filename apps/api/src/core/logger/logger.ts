import pino from 'pino';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Logger estructurado (JSON en prod). El transport "pretty" usa worker threads,
 * por eso solo se activa en desarrollo (no en serverless).
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  redact: ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.token'],
  ...(isDev && { transport: { target: 'pino-pretty', options: { singleLine: true } } }),
});

export type Logger = typeof logger;
