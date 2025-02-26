
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { KitchenOrder, KitchenOrderItem } from "@/types/staff";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useKitchenState = () => {
  const { toast } = useToast();
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
    kitchenOrders,
    isLoading,
    updateKitchenOrderStatus: (orderId: number, status: KitchenOrder["status"]) =>
      updateStatusMutation.mutate({ orderId, status }),
    createKitchenOrder: (order: Omit<KitchenOrder, "id" | "created_at" | "updated_at">) =>
      createOrderMutation.mutate(order),
    updateOrderPriority: (orderId: number, priority: KitchenOrder["priority"]) =>
      updateOrderPriority.mutate({ orderId, priority }),
    updateItemStatus: (
      orderId: number, 
      itemId: number, 
      status: KitchenOrderItem["status"], 
      assignedChef?: string
    ) => updateItemStatus.mutate({ orderId, itemId, status, assignedChef })
  };
};
