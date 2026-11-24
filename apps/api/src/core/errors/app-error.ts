import type { ErrorCode } from '@af/schemas';

export interface AppErrorOptions {
  details?: unknown;
  cause?: unknown;
  /** Segundos sugeridos al cliente para reintentar (cabecera Retry-After). */
  retryAfter?: number;
}

/** Error de dominio con status y código estable. Es lo ÚNICO que debe llegar al error handler. */
export class AppError extends Error {
  readonly details?: unknown;
  readonly retryAfter?: number;

  constructor(
    readonly status: number,
    readonly code: ErrorCode,
    message: string,
    opts: AppErrorOptions = {},
  ) {
    super(message, { cause: opts.cause });
    this.name = 'AppError';
    this.details = opts.details;
    this.retryAfter = opts.retryAfter;
  }
}
