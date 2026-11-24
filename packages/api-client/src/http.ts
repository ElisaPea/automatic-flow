import type { z } from 'zod';
import { parseErrorResponse } from './parse-error';
import { failure, success, type ApiResult } from './result';

export interface HttpConfig {
  baseUrl: string;
  /** Devuelve el JWT de Clerk (o null si no hay sesión). */
  getToken?: () => Promise<string | null>;
  timeoutMs?: number;
}

export interface RequestOptions<T> {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  schema: z.ZodType<T>;
  signal?: AbortSignal;
}

const buildHeaders = async (config: HttpConfig, hasBody: boolean): Promise<Headers> => {
  const headers = new Headers({ Accept: 'application/json' });
  if (hasBody) headers.set('Content-Type', 'application/json');
  const token = await config.getToken?.().catch(() => null);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return headers;
};

const networkFailure = (err: unknown) =>
  err instanceof DOMException && err.name === 'TimeoutError'
    ? failure({ code: 'timeout', message: 'La petición tardó demasiado', status: null })
    : failure({ code: 'network_error', message: 'Sin conexión con el servidor', status: null });

const parseBody = async <T>(res: Response, schema: z.ZodType<T>): Promise<ApiResult<T>> => {
  const json: unknown = res.status === 204 ? undefined : await res.json().catch(() => undefined);
  const parsed = schema.safeParse(json);
  if (parsed.success) return success(parsed.data);
  return failure({ code: 'invalid_response', message: 'Respuesta inesperada', status: res.status });
};

export const request = async <T>(
  config: HttpConfig,
  path: string,
  opts: RequestOptions<T>,
): Promise<ApiResult<T>> => {
  const timeout = AbortSignal.timeout(config.timeoutMs ?? 10_000);
  const signal = opts.signal ? AbortSignal.any([opts.signal, timeout]) : timeout;
  try {
    const res = await fetch(`${config.baseUrl}${path}`, {
      method: opts.method ?? 'GET',
      headers: await buildHeaders(config, opts.body !== undefined),
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
      signal,
    });
    if (!res.ok) return failure(await parseErrorResponse(res));
    return await parseBody(res, opts.schema);
  } catch (err) {
    return networkFailure(err);
  }
};
