import type { ApiFailure } from './result';
import type { ErrorCode } from '@af/schemas';

const messages: Partial<Record<ErrorCode, string>> = {
  network_error: 'No hay conexión con el servidor. Revisa tu red.',
  timeout: 'El servidor está tardando demasiado. Inténtalo de nuevo.',
  unauthorized: 'Tu sesión ha caducado. Vuelve a iniciar sesión.',
  forbidden: 'No tienes permisos para esta acción.',
  not_found: 'No hemos encontrado lo que buscabas.',
  rate_limited: 'Demasiadas peticiones. Espera unos segundos.',
  service_unavailable: 'Servicio temporalmente no disponible.',
  validation_failed: 'Revisa los datos introducidos.',
};

/** Traduce un error de API a un mensaje de UI. La UI decide por código, nunca por texto. */
export const toUserMessage = (error: ApiFailure): string =>
  messages[error.code] ?? 'Ha ocurrido un error inesperado.';
