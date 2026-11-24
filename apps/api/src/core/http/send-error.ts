import type { ApiErrorBody } from '@af/schemas';
import type { Response } from 'express';
import type { AppError } from '../errors';

/** Única forma de escribir un error en la respuesta: formato homogéneo para todos los clientes. */
export const sendError = (res: Response, err: AppError): void => {
  if (res.headersSent) return;
  if (err.retryAfter) res.setHeader('Retry-After', String(err.retryAfter));
  const body: ApiErrorBody = {
    error: {
      code: err.code,
      message: err.message,
      requestId: res.locals.requestId as string | undefined,
      ...(err.details !== undefined && { details: err.details }),
    },
  };
  res.status(err.status).json(body);
};
