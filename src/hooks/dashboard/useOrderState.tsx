
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
    const channel = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Order update received:', payload);
          fetchOrders();
        }
      )
      .subscribe();

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

      // Transform the data to match the Order type
      const transformedOrders: Order[] = (data || []).map(order => ({
        id: order.id,
        tableNumber: order.table_number,
        items: order.items || [],
        status: order.status,
        total: order.total,
        timestamp: order.timestamp,
        serverName: order.server_name,
        specialInstructions: order.special_instructions,
        guestCount: order.guest_count,
        estimatedPrepTime: order.estimated_prep_time
      }));

      setOrders(transformedOrders);
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
      const newOrder = {
        table_number: tableId,
        server_name: serverName,
        status: 'pending' as const,
        items: [],
        total: 0,
        timestamp: new Date().toISOString(),
        guest_count: 1, // Default value
        estimated_prep_time: 15, // Default value in minutes
        special_instructions: '',
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([newOrder])
        .select()
        .single();

      if (error) throw error;

      // Transform the response to match Order type
      const transformedOrder: Order = {
        id: data.id,
        tableNumber: data.table_number,
        items: data.items || [],
        status: data.status,
        total: data.total,
        timestamp: data.timestamp,
        serverName: data.server_name,
        specialInstructions: data.special_instructions,
        guestCount: data.guest_count,
        estimatedPrepTime: data.estimated_prep_time
      };
      
      toast({
        title: "Order Created",
        description: `New order created for table ${tableId}`,
      });
      
      return transformedOrder;
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

      // Refresh orders after update
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const updateKitchenOrderStatus = async (orderId: number, itemStatus: KitchenOrder['items'][0]['status']) => {
    try {
      const { data: existingOrder, error: fetchError } = await supabase
        .from('kitchen_orders')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (fetchError) throw fetchError;

      const updatedItems = existingOrder.items.map((item: any) => ({
        ...item,
        status: itemStatus
      }));

      const { error: updateError } = await supabase
        .from('kitchen_orders')
        .update({ 
          items: updatedItems,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', orderId);

      if (updateError) throw updateError;

      toast({
        title: "Kitchen Order Updated",
        description: `Kitchen order status updated to ${itemStatus}`,
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
