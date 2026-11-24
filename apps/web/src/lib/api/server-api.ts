import 'server-only';
import { createApiClient } from '@af/api-client';
import { auth } from '@clerk/nextjs/server';
import { env } from '../env';

/** Cliente de API para Server Components / Server Actions, autenticado con el JWT de Clerk. */
export const serverApi = async () => {
  const { getToken } = await auth();
  return createApiClient({ baseUrl: env.NEXT_PUBLIC_API_URL, getToken: () => getToken() });
};
