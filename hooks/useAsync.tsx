import { useState, useCallback } from "react";

interface ConfigType<T, P> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
}

function useAsync<T, P>(
  callback: (payload?: P) => Promise<T>,
  config: ConfigType<T, P> = {}
) {
  const { immediate = false, onSuccess, onError } = config;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    (payload?: P): Promise<T> => {
      return new Promise(async (resolve, reject) => {
        try {
          setLoading(true);
          setError(null);
          const result = await callback(payload);
          setData(result);
          onSuccess?.(result);
          resolve(result);
        } catch (err) {
          setError(err);
          onError?.(err);
          reject(err);
        } finally {
          setLoading(false);
        }
      });
    },
    [callback, onSuccess, onError]
  );

  if (immediate) {
    execute({} as P);
  }

  return { loading, error, data, execute };
}

export default useAsync;
