
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { KitchenOrder, Order } from "@/types/staff";
import { useToast } from "@/components/ui/use-toast";

export const useKitchenState = () => {
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchKitchenOrders();
    subscribeToKitchenUpdates();
  }, []);

  const fetchKitchenOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('kitchen_orders')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      setKitchenOrders(data.map(order => ({
        id: order.id,
        orderId: order.order_id,
        tableNumber: order.table_number,
        items: order.items,
        status: order.status,
        priority: order.priority,
        estimatedDeliveryTime: order.estimated_delivery_time,
        createdAt: order.created_at
      })));
    } catch (error) {
      console.error('Error fetching kitchen orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch kitchen orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToKitchenUpdates = () => {
    const channel = supabase
      .channel('kitchen-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kitchen_orders' },
        () => {
          fetchKitchenOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const updateOrderStatus = async (orderId: number, status: KitchenOrder['status']) => {
    try {
      const { error } = await supabase
        .from('kitchen_orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      setKitchenOrders(orders =>
        orders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );

      toast({
        title: "Order Updated",
        description: `Order #${orderId} status changed to ${status}`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const updateItemStatus = async (
    orderId: number,
    itemId: number,
    status: KitchenOrder['items'][0]['status']
  ) => {
    try {
      const order = kitchenOrders.find(o => o.id === orderId);
      if (!order) return;

      const updatedItems = order.items.map(item =>
        item.id === itemId ? { ...item, status } : item
      );

      const { error } = await supabase
        .from('kitchen_orders')
        .update({ items: updatedItems })
        .eq('id', orderId);

      if (error) throw error;

      setKitchenOrders(orders =>
        orders.map(order =>
          order.id === orderId ? { ...order, items: updatedItems } : order
        )
      );

      toast({
        title: "Item Updated",
        description: `Item status changed to ${status}`,
      });
    } catch (error) {
      console.error('Error updating item status:', error);
      toast({
        title: "Error",
        description: "Failed to update item status",
        variant: "destructive",
      });
    }
  };

  return {
    kitchenOrders,
    loading,
    updateOrderStatus,
    updateItemStatus,
  };
};
