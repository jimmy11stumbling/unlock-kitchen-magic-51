import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import type { KitchenOrder, Order, OrderItem } from '@/types';
import { orderService } from './services/orderService';
import { transformDatabaseOrder } from "./utils/orderTransformers";
import { OrderStatus } from "./types/orderTypes";
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
      const ordersData = await orderService.fetchOrders();
      const transformedOrders = ordersData.map(order => 
        transformDatabaseOrder(order)
      );
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
      const newOrderData = {
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

      const data = await orderService.createOrder(newOrderData);
      const transformedOrder = transformDatabaseOrder(data);
      
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
      await orderService.updateOrderStatus(orderId, status);
      
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

  const updateKitchenOrderStatus = async (
    orderId: number, 
    itemStatus: KitchenOrder['items'][0]['status']
  ) => {
    try {
      await orderService.updateKitchenOrderStatus(orderId, itemStatus);

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
