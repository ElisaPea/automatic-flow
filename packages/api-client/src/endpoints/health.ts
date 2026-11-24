import { healthSchema } from '@af/schemas';
import { request, type HttpConfig } from '../http';

export const healthEndpoints = (config: HttpConfig) => ({
  check: () => request(config, '/health', { schema: healthSchema }),
});
