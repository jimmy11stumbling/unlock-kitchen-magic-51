
import { useState, useEffect } from "react";
import type { KitchenOrder, Order, OrderItem } from "@/types/staff";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PostgrestResponse } from "@supabase/supabase-js";

// Define base types for database
type Json = string | number | boolean | { [key: string]: Json } | Json[];
type OrderStatus = "pending" | "preparing" | "ready" | "delivered";

// Define the database schema types
interface DatabaseOrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface SupabaseOrder {
  created_at: string;
  estimated_prep_time: number;
  guest_count: number;
  id: number;
  items: Json;
  payment_method: string;
  payment_status: string;
  server_name: string;
  special_instructions: string;
  status: string;
  table_number: number;
  timestamp: string;
  total: number;
  updated_at: string;
}

// Type for inserting a new order
type NewSupabaseOrder = Omit<SupabaseOrder, 'id'>;

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

  const transformDatabaseOrder = (dbOrder: SupabaseOrder): Order => {
    // First, safely cast items to an array of unknown, then to DatabaseOrderItem[]
    const items = Array.isArray(dbOrder.items) 
      ? (dbOrder.items as unknown as DatabaseOrderItem[]).map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        }))
      : [];

    return {
      id: dbOrder.id,
      tableNumber: dbOrder.table_number,
      items,
      status: dbOrder.status as OrderStatus,
      total: dbOrder.total,
      timestamp: dbOrder.timestamp,
      serverName: dbOrder.server_name,
      specialInstructions: dbOrder.special_instructions,
      guestCount: dbOrder.guest_count,
      estimatedPrepTime: dbOrder.estimated_prep_time
    };
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;

      // Ensure data is an array before mapping
      const ordersData = Array.isArray(data) ? data : [];
      const transformedOrders = ordersData.map((order: SupabaseOrder) => transformDatabaseOrder(order));
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
      const newOrderData: NewSupabaseOrder = {
        table_number: tableId,
        server_name: serverName,
        status: "pending",
        items: [],
        total: 0,
        timestamp: new Date().toISOString(),
        guest_count: 1,
        estimated_prep_time: 15,
        special_instructions: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        payment_method: 'pending',
        payment_status: 'pending'
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(newOrderData)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from insert');

      const transformedOrder = transformDatabaseOrder(data as SupabaseOrder);
      
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

  const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Order Updated",
        description: `Order status updated to ${status}`,
      });

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

      if (!existingOrder || !Array.isArray(existingOrder.items)) {
        throw new Error('Invalid kitchen order data');
      }

      const updatedItems = existingOrder.items.map((item: Record<string, any>) => ({
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
