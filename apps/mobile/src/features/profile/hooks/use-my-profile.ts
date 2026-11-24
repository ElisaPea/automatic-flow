import { useCallback } from 'react';
import { useApi } from '@/lib/api/use-api';
import { useQuery } from '@/lib/api/use-query';

export const useMyProfile = () => {
  const api = useApi();
  const fetcher = useCallback(() => api.profile.me(), [api]);
  return useQuery(fetcher);
};
