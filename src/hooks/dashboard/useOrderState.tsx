
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Order, KitchenOrder } from "@/types/staff";
import { supabase } from "@/integrations/supabase/client";
import { 
  determineStation, 
  assignChef, 
  calculateEstimatedPrepTime,
  checkAllergenConflicts,
  optimizeCourseOrder,
  validateOrderCompletion
} from "@/utils/kitchenUtils";

export const useOrderState = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        const { data: kitchenData, error: kitchenError } = await supabase
          .from('kitchen_orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (kitchenError) throw kitchenError;

        setOrders(ordersData);
        setKitchenOrders(kitchenData);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error fetching orders",
          description: "Could not load orders. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Subscribe to real-time changes
    const ordersSubscription = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => prev.map(order => 
              order.id === payload.new.id ? payload.new : order
            ));
          }
        }
      )
      .subscribe();

    fetchOrders();

    return () => {
      ordersSubscription.unsubscribe();
    };
  }, [toast]);

  const addOrder = async (order: Omit<Order, "id" | "timestamp">) => {
    try {
      const response = await fetch('/api/process-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: order }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Order Created",
        description: `Order #${result.data.id} has been sent to kitchen`,
      });

      return result.data;
    } catch (error) {
      console.error("Error adding order:", error);
      toast({
        title: "Error creating order",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  };

  const updateOrderStatus = async (orderId: number, status: Order["status"]) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      // If order is delivered, update kitchen order status
      if (status === "delivered") {
        const { error: kitchenError } = await supabase
          .from('kitchen_orders')
          .update({ 
            items: kitchenOrders
              .find(order => order.orderId === orderId)?.items
              .map(item => ({ ...item, status: "delivered" }))
          })
          .eq('order_id', orderId);

        if (kitchenError) throw kitchenError;
      }

      toast({
        title: "Order Updated",
        description: `Order #${orderId} status changed to ${status}`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error updating order",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const updateKitchenOrderStatus = async (
    orderId: number,
    itemId: number,
    status: KitchenOrder["items"][0]["status"]
  ) => {
    try {
      const kitchenOrder = kitchenOrders.find(o => o.orderId === orderId);
      if (!kitchenOrder) throw new Error("Kitchen order not found");

      const updatedItems = kitchenOrder.items.map(item =>
        item.menuItemId === itemId ? { ...item, status } : item
      );

      const { error } = await supabase
        .from('kitchen_orders')
        .update({ items: updatedItems })
        .eq('order_id', orderId);

      if (error) throw error;

      // Check if all items are ready and update order status accordingly
      if (validateOrderCompletion(updatedItems)) {
        await updateOrderStatus(orderId, "ready");
      }

      toast({
        title: "Item Status Updated",
        description: `Item status updated to ${status}`,
      });
    } catch (error) {
      console.error("Error updating kitchen order status:", error);
      toast({
        title: "Error updating item",
        description: "Failed to update item status",
        variant: "destructive"
      });
    }
  };

  return {
    orders,
    kitchenOrders,
    isLoading,
    addOrder,
    updateOrderStatus,
    updateKitchenOrderStatus,
  };
};
