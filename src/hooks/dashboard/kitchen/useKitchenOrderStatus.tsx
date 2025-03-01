
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { KitchenOrder } from "@/types/staff";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useKitchenOrderStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number, status: KitchenOrder["status"] }) => {
      const { data, error } = await supabase
        .from('kitchen_orders')
        .update({ 
          status, 
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
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  });

  const updateOrderPriority = useMutation({
    mutationFn: async ({ orderId, priority }: { orderId: number, priority: KitchenOrder["priority"] }) => {
      const { data, error } = await supabase
        .from('kitchen_orders')
        .update({ 
          priority,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
      toast({
        title: "Success",
        description: "Order priority updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order priority",
        variant: "destructive",
      });
    }
  });

  return {
    updateKitchenOrderStatus: (orderId: number, status: KitchenOrder["status"]) =>
      updateStatusMutation.mutate({ orderId, status }),
    updateOrderPriority: (orderId: number, priority: KitchenOrder["priority"]) =>
      updateOrderPriority.mutate({ orderId, priority }),
  };
};
