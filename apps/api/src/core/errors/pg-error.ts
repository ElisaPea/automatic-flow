import type { AppError } from './app-error';
import { badRequest, conflict, serviceUnavailable, timeout } from './http-errors';

interface PgLikeError {
  code: string;
  constraint?: string;
}

type Mapper = (err: PgLikeError) => AppError;

const unavailable: Mapper = (cause) => serviceUnavailable(undefined, { cause });
const invalidData: Mapper = (cause) =>
  badRequest('Datos no válidos para la base de datos', { cause });
const notMigrated: Mapper = (cause) =>
  serviceUnavailable('Esquema de base de datos no migrado', { cause });

/** Tabla código Postgres / red → AppError. Añadir aquí cualquier caso nuevo. */
const MAPPERS: Record<string, Mapper> = {
  ECONNREFUSED: unavailable,
  ECONNRESET: unavailable,
  ETIMEDOUT: unavailable,
  ENOTFOUND: unavailable,
  EAI_AGAIN: unavailable,
  '57P01': unavailable, // admin_shutdown
  '57P03': unavailable, // cannot_connect_now
  '53300': unavailable, // too_many_connections
  '08000': unavailable,
  '08003': unavailable,
  '08006': unavailable,
  '23505': (cause) =>
    conflict('El recurso ya existe', { cause, details: { constraint: cause.constraint } }),
  '23503': (cause) => conflict('Referencia a un recurso inexistente', { cause }),
  '23502': invalidData,
  '23514': invalidData,
  '22P02': invalidData,
  '22001': invalidData,
  '57014': (cause) => timeout('La consulta excedió el tiempo máximo', { cause }),
  '42P01': notMigrated,
  '42703': notMigrated,
};

const isPgLike = (err: unknown): err is PgLikeError =>
  typeof err === 'object' && err !== null && typeof (err as PgLikeError).code === 'string';

/** Traduce errores de Postgres/red a AppError. Devuelve null si no es un error de BD conocido. */
export const mapPgError = (err: unknown): AppError | null => {
  if (!isPgLike(err)) return null;
  return MAPPERS[err.code]?.(err) ?? null;
};
