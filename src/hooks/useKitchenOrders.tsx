
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { KitchenOrder } from "@/types/staff";

export function useKitchenOrders(autoRefresh = true) {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();

    if (autoRefresh) {
      const interval = setInterval(fetchOrders, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, we'd fetch from Supabase
      // This is simulated data for now
      const mockOrders: KitchenOrder[] = [
        {
          id: 101,
          tableNumber: 5,
          serverName: "Alex Johnson",
          status: "new",
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          estimatedPrepTime: 20,
          specialInstructions: "Gluten-free preparation required",
          items: [
            {
              name: "Caesar Salad",
              quantity: 1,
              status: "pending",
              modifications: ["No croutons", "Dressing on the side"]
            },
            {
              name: "Grilled Salmon",
              quantity: 1,
              status: "pending",
              modifications: ["Medium well"]
            }
          ]
        },
        {
          id: 102,
          tableNumber: 8,
          serverName: "Jamie Smith",
          status: "in-progress",
          timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
          estimatedPrepTime: 25,
          specialInstructions: "",
          items: [
            {
              name: "Spaghetti Carbonara",
              quantity: 2,
              status: "cooking",
              modifications: []
            },
            {
              name: "Garlic Bread",
              quantity: 1,
              status: "ready",
              modifications: ["Extra garlic"]
            }
          ]
        },
        {
          id: 103,
          tableNumber: 12,
          serverName: "Morgan Lee",
          status: "ready",
          timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
          estimatedPrepTime: 15,
          specialInstructions: "Customer is in a hurry",
          items: [
            {
              name: "Margherita Pizza",
              quantity: 1,
              status: "ready",
              modifications: ["Light cheese"]
            },
            {
              name: "Tiramisu",
              quantity: 1,
              status: "ready",
              modifications: []
            }
          ]
        }
      ];

      setOrders(mockOrders);

      // In a real implementation with Supabase, we'd do something like:
      /*
      const { data, error } = await supabase
        .from('kitchen_orders')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      setOrders(data);
      */
    } catch (error) {
      console.error("Error fetching kitchen orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch kitchen orders",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      // Optimistic update for UI
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );

      // In a real app, we'd update in Supabase
      // const { error } = await supabase
      //   .from('kitchen_orders')
      //   .update({ status })
      //   .eq('id', orderId);
      
      // if (error) throw error;

      toast({
        title: "Order Updated",
        description: `Order #${orderId} status changed to ${status}`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
      // Revert the optimistic update
      fetchOrders();
    }
  };

  const updateItemStatus = async (orderId: number, itemIdx: number, status: string) => {
    try {
      // Optimistic update for UI
      setOrders(prev => 
        prev.map(order => {
          if (order.id === orderId) {
            const updatedItems = [...order.items];
            if (updatedItems[itemIdx]) {
              updatedItems[itemIdx] = { ...updatedItems[itemIdx], status };
            }
            return { ...order, items: updatedItems };
          }
          return order;
        })
      );

      // In a real app, we'd update in Supabase
      // This would be more complex with a JSON array field

      toast({
        title: "Item Updated",
        description: `Item status changed to ${status}`,
      });

      // Check if all items are ready, update order status if needed
      const updatedOrder = orders.find(o => o.id === orderId);
      if (updatedOrder && status === "ready" && 
          updatedOrder.items.every(item => item.status === "ready" || item.status === "cancelled")) {
        updateOrderStatus(orderId, "ready");
      }
    } catch (error) {
      console.error("Error updating item status:", error);
      toast({
        title: "Error",
        description: "Failed to update item status",
        variant: "destructive"
      });
      // Revert the optimistic update
      fetchOrders();
    }
  };

  return {
    orders,
    isLoading,
    updateOrderStatus,
    updateItemStatus,
    refreshOrders: fetchOrders
  };
}
