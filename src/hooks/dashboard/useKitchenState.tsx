
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { KitchenOrder } from "@/types/staff";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useKitchenState = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: kitchenOrders = [], isLoading } = useQuery({
    queryKey: ['kitchenOrders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kitchen_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as KitchenOrder[];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number, status: KitchenOrder["status"] }) => {
      const { data, error } = await supabase
        .from('kitchen_orders')
        .update({ 
          status, 
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
      toast({
        title: "Order Updated",
        description: "The order status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    }
  });

  const createOrderMutation = useMutation({
    mutationFn: async (order: Omit<KitchenOrder, "id" | "created_at" | "updated_at">) => {
      const now = new Date().toISOString();
      const newOrder = {
        ...order,
        created_at: now,
        updated_at: now
      };

      const { data, error } = await supabase
        .from('kitchen_orders')
        .insert([newOrder])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
      toast({
        title: "Order Created",
        description: "New kitchen order has been created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create kitchen order.",
        variant: "destructive",
      });
    }
  });

  return {
    kitchenOrders,
    isLoading,
    updateKitchenOrderStatus: (orderId: number, status: KitchenOrder["status"]) =>
      updateStatusMutation.mutate({ orderId, status }),
    createKitchenOrder: (order: Omit<KitchenOrder, "id" | "created_at" | "updated_at">) =>
      createOrderMutation.mutate(order),
  };
};
