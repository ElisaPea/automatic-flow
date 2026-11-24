import express, { type Express } from 'express';
import { serviceUnavailable } from './core/errors';
import { sendError } from './core/http/send-error';

/** App mínima para cuando falta configuración: responde 503 en lugar de crashear. */
export const createUnavailableApp = (): Express => {
  const app = express();
  app.disable('x-powered-by');
  app.use((_req, res) =>
    sendError(res, serviceUnavailable('API mal configurada', { retryAfter: 60 })),
  );
  return app;
};
