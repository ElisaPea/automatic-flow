import { apiErrorSchema, type ErrorCode } from '@af/schemas';
import type { ApiFailure } from './result';

const STATUS_CODES: Record<number, ErrorCode> = {
  401: 'unauthorized',
  403: 'forbidden',
  404: 'not_found',
  408: 'timeout',
  409: 'conflict',
  413: 'payload_too_large',
  422: 'validation_failed',
  429: 'rate_limited',
  504: 'timeout',
};

const statusToCode = (status: number): ErrorCode =>
  STATUS_CODES[status] ?? (status >= 500 ? 'service_unavailable' : 'bad_request');

/** Convierte una respuesta no-2xx en ApiFailure, tolerando cuerpos no-JSON. */
export const parseErrorResponse = async (res: Response): Promise<ApiFailure> => {
  const body: unknown = await res.json().catch(() => null);
  const parsed = apiErrorSchema.safeParse(body);
  if (parsed.success) return { ...parsed.data.error, status: res.status };
  return { code: statusToCode(res.status), message: res.statusText || 'Error', status: res.status };
};
