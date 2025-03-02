import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { KitchenOrder } from "@/types/staff";

export const useKitchenNotifications = () => {
  const [orderAlerts, setOrderAlerts] = useState<KitchenOrder[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrderAlerts();
    subscribeToOrderAlerts();
  }, []);

  const fetchOrderAlerts = async () => {
    const { data, error } = await supabase
      .from('kitchen_orders')
      .select('*')
      .in('status', ['pending', 'preparing'])
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch order alerts",
        variant: "destructive",
      });
      return;
    }

    setOrderAlerts(
      data.map((order: any) => ({
        id: order.id,
        order_id: order.order_id,
        status: order.status,
        priority: order.priority,
        // Map database fields to app properties
        tableNumber: order.table_number,
        serverName: order.server_name,
        // Include database properties for compatibility
        table_number: order.table_number,
        server_name: order.server_name,
        items: order.items,
        created_at: order.created_at,
        updated_at: order.updated_at,
        estimated_delivery_time: order.estimated_delivery_time,
        notes: order.notes,
        coursing: order.coursing
      })) as KitchenOrder[]
    );
  };

  const subscribeToOrderAlerts = () => {
    const channel = supabase
      .channel('kitchen-order-alerts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kitchen_orders'
        },
        (payload) => {
          console.log('Kitchen order update received:', payload);
          fetchOrderAlerts();

          if (payload.eventType === 'UPDATE' && payload.new) {
            const order = payload.new as any;
            if (order.status === 'ready') {
              toast({
                title: "Order Ready",
                description: `Order #${order.order_id} (Table ${order.tableNumber}) has been marked as ready`,
              });
            } else if (order.status === 'delivered') {
              toast({
                title: "Order Delivered",
                description: `Order #${order.order_id} (Table ${order.tableNumber}) has been marked as delivered`,
              });
            }
          } else if (payload.eventType === 'INSERT' && payload.new) {
            const order = payload.new as any;
            toast({
              title: "New Order",
              description: `New order #${order.order_id} (Table ${order.tableNumber}) has been placed`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  useEffect(() => {
    const delayedOrders = orderAlerts.filter(
      (order) => new Date(order.estimated_delivery_time) < new Date()
    );

    delayedOrders.forEach((order) => {
      toast({
        title: "Delayed Order",
        description: `Order #${order.order_id} (Table ${order.tableNumber}) is delayed!`,
        variant: "destructive",
      });
    });
  }, [orderAlerts, toast]);

  return {
    orderAlerts,
  };
};
