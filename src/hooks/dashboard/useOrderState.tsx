
import { useState, useEffect } from "react";
import type { KitchenOrder, Order } from "@/types/staff";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useOrderState = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to order updates
    const channel = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Order update received:', payload);
          // Refresh orders
          fetchOrders();
        }
      )
      .subscribe();

    // Initial fetch
    fetchOrders();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (tableId: number, serverName: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            table_id: tableId,
            server_name: serverName,
            status: 'pending',
            items: [],
            total: 0,
            timestamp: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Order Created",
        description: `New order created for table ${tableId}`,
      });
      
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
    }
  };

  const updateOrderStatus = async (orderId: number, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Order Updated",
        description: `Order status updated to ${status}`,
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

  const updateKitchenOrderStatus = async (orderId: number, status: KitchenOrder['items'][0]['status']) => {
    try {
      const { error } = await supabase
        .from('kitchen_orders')
        .update({ status })
        .eq('order_id', orderId);

      if (error) throw error;

      toast({
        title: "Kitchen Order Updated",
        description: `Kitchen order status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating kitchen order status:', error);
      toast({
        title: "Error",
        description: "Failed to update kitchen order status",
        variant: "destructive",
      });
    }
  };

  return {
    orders,
    kitchenOrders,
    isLoading: loading,
    addOrder,
    updateOrderStatus,
    updateKitchenOrderStatus,
  };
};
