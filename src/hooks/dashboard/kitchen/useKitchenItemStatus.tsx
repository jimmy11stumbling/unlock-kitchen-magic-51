
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { KitchenOrderItem } from "@/types/staff";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useKitchenItemStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateItemStatus = useMutation({
    mutationFn: async ({ 
      orderId, 
      itemId, 
      status, 
      assignedChef 
    }: { 
      orderId: number; 
      itemId: number; 
      status: KitchenOrderItem["status"]; 
      assignedChef?: string;
    }) => {
      // First get the current order
      const { data: order, error: fetchError } = await supabase
        .from('kitchen_orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (fetchError) throw fetchError;
      
      if (!order || !order.items || !Array.isArray(order.items)) {
        throw new Error('Invalid order data');
      }

      // Update the specific item's status
      const updatedItems = order.items.map((item: any) => {
        if (item.id === itemId) {
          return {
            ...item,
            status,
            assigned_chef: assignedChef || item.assigned_chef,
            start_time: status === 'preparing' ? new Date().toISOString() : item.start_time,
            completion_time: status === 'ready' ? new Date().toISOString() : item.completion_time
          };
        }
        return item;
      });

      // Update the order with new items array
      const { data, error } = await supabase
        .from('kitchen_orders')
        .update({ 
          items: updatedItems,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update item status",
        variant: "destructive",
      });
    }
  });

  return {
    updateItemStatus: (
      orderId: number, 
      itemId: number, 
      status: KitchenOrderItem["status"], 
      assignedChef?: string
    ) => updateItemStatus.mutate({ orderId, itemId, status, assignedChef })
  };
};
