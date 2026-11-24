import { AppError, type AppErrorOptions } from './app-error';

type Opts = AppErrorOptions;

export const badRequest = (msg = 'Petición inválida', o?: Opts) =>
  new AppError(400, 'bad_request', msg, o);
export const validationFailed = (details: unknown, msg = 'Datos inválidos') =>
  new AppError(422, 'validation_failed', msg, { details });
export const unauthorized = (msg = 'No autenticado') => new AppError(401, 'unauthorized', msg);
export const forbidden = (msg = 'Sin permisos') => new AppError(403, 'forbidden', msg);
export const notFound = (msg = 'Recurso no encontrado') => new AppError(404, 'not_found', msg);
export const conflict = (msg = 'Conflicto con el estado actual', o?: Opts) =>
  new AppError(409, 'conflict', msg, o);
export const payloadTooLarge = (msg = 'Cuerpo demasiado grande') =>
  new AppError(413, 'payload_too_large', msg);
export const rateLimited = (retryAfter: number) =>
  new AppError(429, 'rate_limited', 'Demasiadas peticiones', { retryAfter });
export const timeout = (msg = 'La operación tardó demasiado', o?: Opts) =>
  new AppError(504, 'timeout', msg, o);
export const serviceUnavailable = (msg = 'Servicio no disponible temporalmente', o?: Opts) =>
  new AppError(503, 'service_unavailable', msg, { retryAfter: 5, ...o });
