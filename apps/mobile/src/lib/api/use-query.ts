import { toUserMessage, type ApiResult } from '@af/api-client';
import { useCallback, useEffect, useState } from 'react';

type QueryState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T };

const toState = <T>(result: ApiResult<T>): QueryState<T> =>
  result.ok
    ? { status: 'success', data: result.data }
    : { status: 'error', message: toUserMessage(result.error) };

/** Hook mínimo de carga de datos con estados explícitos y reintento. */
export const useQuery = <T>(fetcher: () => Promise<ApiResult<T>>) => {
  const [state, setState] = useState<QueryState<T>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true; // evita setState tras desmontar o con respuestas obsoletas
    void fetcher().then((result) => {
      if (active) setState(toState(result));
    });
    return () => {
      active = false;
    };
  }, [fetcher, attempt]);

  const refetch = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt((n) => n + 1);
  }, []);

  return { state, refetch };
};
