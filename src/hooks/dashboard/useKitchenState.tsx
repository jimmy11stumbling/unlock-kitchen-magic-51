
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { KitchenOrder, KitchenOrderItem } from "@/types/staff";
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

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: Omit<KitchenOrder, "id" | "created_at" | "updated_at">) => {
      const now = new Date().toISOString();
      
      // Convert KitchenOrderItem[] to a plain object array for Supabase
      const serializedItems = orderData.items.map(item => ({
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
      }));

      const dbOrder = {
        order_id: orderData.order_id,
        table_number: orderData.table_number,
        server_name: orderData.server_name,
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
    kitchenOrders,
    isLoading,
    updateKitchenOrderStatus: (orderId: number, status: KitchenOrder["status"]) =>
      updateStatusMutation.mutate({ orderId, status }),
    createKitchenOrder: (order: Omit<KitchenOrder, "id" | "created_at" | "updated_at">) =>
      createOrderMutation.mutate(order)
  };
};
