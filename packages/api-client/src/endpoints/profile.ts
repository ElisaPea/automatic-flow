import { profileSchema, type UpdateProfileInput } from '@af/schemas';
import { request, type HttpConfig } from '../http';

export const profileEndpoints = (config: HttpConfig) => ({
  me: () => request(config, '/v1/profile/me', { schema: profileSchema }),
  update: (input: UpdateProfileInput) =>
    request(config, '/v1/profile/me', { method: 'PATCH', body: input, schema: profileSchema }),
});
