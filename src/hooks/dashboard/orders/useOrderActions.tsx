
import { useToast } from "@/components/ui/use-toast";
import type { Order, KitchenOrder } from "@/types/staff";
import { supabase } from "@/integrations/supabase/client";
import { validateOrderCompletion } from "@/utils/kitchenUtils";

export const useOrderActions = (kitchenOrders: KitchenOrder[]) => {
  const { toast } = useToast();

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
    addOrder,
    updateOrderStatus,
    updateKitchenOrderStatus,
  };
};
