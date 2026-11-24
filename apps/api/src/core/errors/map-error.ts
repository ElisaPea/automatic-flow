import { ZodError } from 'zod';
import { AppError } from './app-error';
import { badRequest, payloadTooLarge, validationFailed } from './http-errors';
import { mapPgError } from './pg-error';

interface HttpLikeError {
  httpCode?: number;
  status?: number;
  type?: string;
  message?: string;
}

const fromStatus = (status: number, message: string): AppError | null => {
  if (status === 400) return badRequest(message);
  if (status === 401) return new AppError(401, 'unauthorized', 'No autenticado');
  if (status === 403) return new AppError(403, 'forbidden', 'Sin permisos');
  if (status === 404) return new AppError(404, 'not_found', 'Recurso no encontrado');
  if (status === 413) return payloadTooLarge();
  return null;
};

/** Errores de body-parser (JSON mal formado, cuerpo grande) y HttpError de routing-controllers. */
const mapHttpLike = (err: unknown): AppError | null => {
  if (typeof err !== 'object' || err === null) return null;
  const e = err as HttpLikeError;
  if (e.type === 'entity.parse.failed') return badRequest('JSON mal formado');
  if (e.type === 'entity.too.large') return payloadTooLarge();
  const status = e.httpCode ?? e.status;
  return typeof status === 'number' ? fromStatus(status, e.message ?? 'Petición inválida') : null;
};

/**
 * Normaliza cualquier error a AppError.
 * Devuelve null solo para errores realmente desconocidos (= bug que hay que corregir).
 */
export const mapError = (err: unknown): AppError | null => {
  if (err instanceof AppError) return err;
  if (err instanceof ZodError) return validationFailed(err.issues);
  return mapPgError(err) ?? mapHttpLike(err);
};
