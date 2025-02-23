
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Order, KitchenOrder } from "@/types/staff";

export const useOrderState = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>([]);

  const addOrder = (order: Omit<Order, "id" | "timestamp">) => {
    const newOrder: Order = {
      id: orders.length + 1,
      timestamp: new Date().toISOString(),
      ...order,
    };
    setOrders([...orders, newOrder]);
    toast({
      title: "New order created",
      description: `Order #${newOrder.id} has been created.`,
    });
  };

  const updateOrderStatus = (orderId: number, status: Order["status"]) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const updateKitchenOrderStatus = (
    orderId: number,
    itemId: number,
    status: KitchenOrder["items"][0]["status"]
  ) => {
    setKitchenOrders(
      kitchenOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item) =>
                item.menuItemId === itemId
                  ? {
                      ...item,
                      status,
                      startTime: status === "preparing" ? new Date().toISOString() : item.startTime,
                      completionTime:
                        status === "delivered" ? new Date().toISOString() : item.completionTime,
                    }
                  : item
              ),
            }
          : order
      )
    );

    toast({
      title: "Order status updated",
      description: `Item status updated to ${status}`,
    });
  };

  return {
    orders,
    kitchenOrders,
    addOrder,
    updateOrderStatus,
    updateKitchenOrderStatus,
  };
};
