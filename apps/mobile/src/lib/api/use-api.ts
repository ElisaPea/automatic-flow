import { createApiClient } from '@af/api-client';
import { useAuth } from '@clerk/expo';
import { useMemo } from 'react';
import { env } from '../env';

/** Cliente de API autenticado con la sesión actual de Clerk. */
export const useApi = () => {
  const { getToken } = useAuth();
  return useMemo(
    () => createApiClient({ baseUrl: env.EXPO_PUBLIC_API_URL, getToken: () => getToken() }),
    [getToken],
  );
};
