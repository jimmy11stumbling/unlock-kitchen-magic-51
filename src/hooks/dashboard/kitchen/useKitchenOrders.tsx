
import { supabase } from "@/integrations/supabase/client";
import type { KitchenOrder } from "@/types/staff";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useKitchenOrders = () => {
  const queryClient = useQueryClient();

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('kitchen-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kitchen_orders'
        },
        (payload) => {
          console.log('Kitchen order update received:', payload);
          queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: kitchenOrders = [], isLoading } = useQuery({
    queryKey: ['kitchenOrders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kitchen_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((order: any) => ({
        ...order,
        items: Array.isArray(order.items) ? order.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          status: item.status,
          notes: item.notes,
          menu_item_id: item.menu_item_id,
          cooking_station: item.cooking_station,
          assigned_chef: item.assigned_chef,
          modifications: item.modifications,
          allergen_alert: item.allergen_alert,
          start_time: item.start_time,
          completion_time: item.completion_time
        })) : []
      })) as KitchenOrder[];
    }
  });

  return {
    kitchenOrders,
    isLoading
  };
};
