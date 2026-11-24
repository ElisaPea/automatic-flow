import { healthEndpoints } from './endpoints/health';
import { profileEndpoints } from './endpoints/profile';
import type { HttpConfig } from './http';

export const createApiClient = (config: HttpConfig) => ({
  health: healthEndpoints(config),
  profile: profileEndpoints(config),
});

export type ApiClient = ReturnType<typeof createApiClient>;
export type { HttpConfig } from './http';
export * from './result';
export * from './error-message';
