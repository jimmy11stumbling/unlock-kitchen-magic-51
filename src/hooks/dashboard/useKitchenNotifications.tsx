import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { KitchenOrder } from "@/types/staff";

export const useKitchenNotifications = () => {
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchKitchenOrders();
    subscribeToKitchenOrders();
  }, []);

  useEffect(() => {
    const newNotifications = getNotifications();
    setNotifications(newNotifications);
  }, [kitchenOrders]);

  const subscribeToKitchenOrders = () => {
    const channel = supabase
      .channel('kitchen-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kitchen_orders'
        },
        () => {
          fetchKitchenOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchKitchenOrders = async () => {
    const { data, error } = await supabase
      .from('kitchen_orders')
      .select('*')
      .in('status', ['pending', 'preparing'])
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch kitchen orders",
        variant: "destructive",
      });
      return;
    }

    setKitchenOrders(data as KitchenOrder[]);
  };

  const getNotifications = () => {
    const notifications = [];
    
    // Add order delay notifications
    for (const order of kitchenOrders) {
      const estimatedDelivery = new Date(order.estimated_delivery_time);
      const now = new Date();
      
      if (estimatedDelivery < now && order.status !== 'delivered') {
        notifications.push({
          id: `delay-${order.id}`,
          title: "Order Delayed",
          message: `Order #${order.order_id} for Table ${order.tableNumber} is past its estimated delivery time`,
          type: 'warning',
          timestamp: now.toISOString()
        });
      }
      
      if (order.priority === 'rush') {
        notifications.push({
          id: `rush-${order.id}`,
          title: "Rush Order",
          message: `Order #${order.order_id} for Table ${order.tableNumber} is marked as rush priority`,
          type: 'alert',
          timestamp: order.created_at
        });
      }
    }
    
    return notifications;
  };

  return { notifications };
};
