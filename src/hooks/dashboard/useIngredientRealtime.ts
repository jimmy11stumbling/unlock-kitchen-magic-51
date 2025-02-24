
import { useState, useEffect } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { QueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RealtimePayload } from './types/ingredientTypes';

export const useIngredientRealtime = (queryClient: QueryClient) => {
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel('ingredients-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ingredients' },
        (payload: RealtimePayload) => {
          console.log('Realtime update:', payload);
          queryClient.invalidateQueries({ queryKey: ['ingredients'] });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to ingredients changes');
        }
      });

    setRealtimeChannel(channel);

    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel)
          .then(() => console.log('Realtime subscription cleaned up'))
          .catch(err => console.error('Error removing channel:', err));
      }
    };
  }, [queryClient]);

  return realtimeChannel;
};
