import { useState, useCallback } from 'react';
import { useContext } from 'react';
import { AlertContext } from '../contexts/AlertContext';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showSuccess, showError } = useContext(AlertContext);

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        setData(result);
        
        if (options.successMessage) {
          showSuccess(options.successMessage);
        }
        
        if (options.onSuccess) {
          options.onSuccess(result);
        }
        
        return result;
      } catch (err: any) {
        const errorObj = err instanceof Error ? err : new Error('An error occurred');
        setError(errorObj);
        
        const errorMsg = options.errorMessage || err?.response?.data?.message || 'Ocorreu um erro';
        showError(errorMsg);
        
        if (options.onError) {
          options.onError(err);
        }
        
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options, showSuccess, showError]
  );

  return {
    data,
    loading,
    error,
    execute,
  };
}
