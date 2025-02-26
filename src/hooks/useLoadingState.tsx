
import { useState, useCallback } from 'react';
import { logger } from '@/services/logging/logger';

interface UseLoadingStateOptions {
  logErrors?: boolean;
}

export function useLoadingState(options: UseLoadingStateOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async <T,>(
    promise: Promise<T>,
    errorMessage: string = 'An error occurred'
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await promise;
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(errorMessage);
      setError(error);
      
      if (options.logErrors) {
        logger.error(errorMessage, { error });
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [options.logErrors]);

  return {
    isLoading,
    error,
    execute
  };
}
