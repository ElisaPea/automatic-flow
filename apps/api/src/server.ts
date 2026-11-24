import { createApp } from './app';
import { loadEnv } from './config/env';
import { closePool } from './core/db/pool';
import { logger } from './core/logger/logger';
import { printConfigErrorBanner, printStartupBanner } from './startup-banner';

/** Arranque como servidor clásico (local, Render, Railway, Fly, Docker, VM...). */
const port = Number(process.env.PORT ?? 4000);
const server = createApp().listen(port, () => {
  logger.info({ port }, `API escuchando en http://localhost:${port}`);
  const env = loadEnv();
  if (env.ok) printStartupBanner('API', port);
  else printConfigErrorBanner(port, env.issues);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  const reason =
    err.code === 'EADDRINUSE' ? `el puerto ${port} ya está en uso (cambia PORT)` : err.message;
  logger.fatal({ err, port }, `No se pudo arrancar la API: ${reason}`);
  process.exit(1);
});

// Keep-alive mayor que el del balanceador para evitar 502 intermitentes.
server.keepAliveTimeout = 65_000;
server.headersTimeout = 66_000;

const shutdown = (signal: string) => {
  logger.info({ signal }, 'Cerrando servidor...');
  server.close(() => {
    closePool()
      .catch((err: unknown) => logger.error({ err }, 'Error cerrando pool'))
      .finally(() => process.exit(0));
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (err) => logger.error({ err }, 'unhandledRejection'));
