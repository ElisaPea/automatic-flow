import type { RequestHandler } from 'express';
import { notFound as notFoundError } from '../core/errors';
import { sendError } from '../core/http/send-error';

export const notFound: RequestHandler = (_req, res) => {
  if (!res.headersSent) sendError(res, notFoundError('Ruta no encontrada'));
};
