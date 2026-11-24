import type { ErrorCode } from '@af/schemas';

export interface ApiFailure {
  code: ErrorCode;
  message: string;
  status: number | null;
  requestId?: string;
  details?: unknown;
}

/** Las llamadas nunca lanzan: siempre devuelven un Result que la UI debe tratar. */
export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiFailure };

export const success = <T>(data: T): ApiResult<T> => ({ ok: true, data });
export const failure = <T = never>(error: ApiFailure): ApiResult<T> => ({ ok: false, error });
