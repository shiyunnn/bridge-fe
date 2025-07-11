import { useEffect } from 'react';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import omit from 'lodash/omit';

import fallback from '@/utils/fallback';
import joinUrlParams from '@/utils/joinUrlParams';

export interface UseApiQueryOptions<Res> extends Omit<UseQueryOptions<Res>, 'queryKey' | 'queryFn'> {
  onError?: (error: any) => void | any;
  onSuccess?: (res: any) => void | any;
}
const useApiQuery = <Res,>(url: string, params?: object, options?: UseApiQueryOptions<Res>, method?: string) => {
  const paramsObj = params || {};

  const result = useQuery<Res>({
    queryKey: [url, paramsObj],
    queryFn: async () => {
      try {
        const res = await fetch(`http://10.2.65.87:8000/api${joinUrlParams(url, params)}`, {
          method: method || 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return await res.json();
      } catch (error) {
        options?.onError?.(error);
        throw error;
      }
    },
    ...omit(options, 'onError', 'onSuccess'),
  });

  useEffect(() => {
    const onSuccessCb = fallback(options?.onSuccess, (res) => res);
    if (result.data) {
      onSuccessCb(result.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.data]);

  useEffect(() => {
    const onErrorCb = fallback(options?.onError, (error) => {
      throw error;
    });
    if (result.error) {
      onErrorCb(result.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.error]);

  return result;
};

export default useApiQuery;
