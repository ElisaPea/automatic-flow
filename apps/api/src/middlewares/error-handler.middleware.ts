import type { ErrorRequestHandler } from 'express';
import { AppError, mapError } from '../core/errors';
import { sendError } from '../core/http/send-error';
import { logger } from '../core/logger/logger';

/**
 * Último eslabón. Todo error conocido se traduce a 4xx/503/504.
 * Un error desconocido es un BUG: se registra como fatal y se responde de forma controlada.
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const requestId = res.locals.requestId as string | undefined;
  const mapped = mapError(err);
  if (mapped) {
    if (mapped.status >= 500) logger.error({ err, requestId }, mapped.message);
    return sendError(res, mapped);
  }
  logger.fatal({ err, requestId, url: req.originalUrl }, 'UNHANDLED_ERROR: caso no cubierto');
  sendError(res, new AppError(500, 'internal', 'Error inesperado. Ya estamos en ello.'));
};
