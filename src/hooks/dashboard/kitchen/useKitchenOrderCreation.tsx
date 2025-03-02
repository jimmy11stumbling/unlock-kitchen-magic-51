
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { KitchenOrder } from "@/types/staff";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useKitchenOrderCreation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: Omit<KitchenOrder, "id" | "created_at" | "updated_at">) => {
      const now = new Date().toISOString();
      
      // Convert KitchenOrderItems to plain objects for Supabase
      const serializedItems = orderData.items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        status: item.status,
        notes: item.notes,
        menu_item_id: item.menu_item_id,
        cooking_station: item.cooking_station,
        assigned_chef: item.assigned_chef,
        modifications: item.modifications || [],
        allergen_alert: item.allergen_alert || false,
        start_time: item.start_time,
        completion_time: item.completion_time
      }));

      const dbOrder = {
        order_id: orderData.order_id,
        tableNumber: orderData.tableNumber,
        serverName: orderData.serverName,
        items: serializedItems,
        status: orderData.status,
        priority: orderData.priority,
        notes: orderData.notes,
        created_at: now,
        updated_at: now,
        estimated_delivery_time: orderData.estimated_delivery_time,
        coursing: orderData.coursing || 'standard'
      };

      const { data, error } = await supabase
        .from('kitchen_orders')
        .insert([dbOrder])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
      toast({
        title: "Success",
        description: "Kitchen order created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create kitchen order",
        variant: "destructive",
      });
    }
  });

  return {
    createKitchenOrder: (order: Omit<KitchenOrder, "id" | "created_at" | "updated_at">) =>
      createOrderMutation.mutate(order)
  };
};
