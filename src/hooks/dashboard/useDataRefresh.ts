
import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useDataRefresh = (interval: number = 30000) => {
  const queryClient = useQueryClient();

  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['sales'] });
    queryClient.invalidateQueries({ queryKey: ['staff'] });
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    queryClient.invalidateQueries({ queryKey: ['reservations'] });
    queryClient.invalidateQueries({ queryKey: ['inventory'] });
  }, [queryClient]);

  useEffect(() => {
    const timer = setInterval(refreshData, interval);
    return () => clearInterval(timer);
  }, [interval, refreshData]);

  return { refreshData };
};
