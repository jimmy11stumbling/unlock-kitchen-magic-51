import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Order, KitchenOrder } from "@/types/staff";

const initialOrders: Order[] = [
  {
    id: 1,
    tableNumber: 5,
    status: "pending",
    items: [
      { id: 1, name: "Classic Burger", quantity: 2, price: 14.99 },
      { id: 2, name: "Caesar Salad", quantity: 1, price: 10.99 }
    ],
    total: 40.97,
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    tableNumber: 3,
    status: "preparing",
    items: [
      { id: 3, name: "Chocolate Lava Cake", quantity: 2, price: 8.99 },
      { id: 4, name: "House Wine", quantity: 2, price: 7.99 }
    ],
    total: 33.96,
    timestamp: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
  },
  {
    id: 3,
    tableNumber: 7,
    status: "ready",
    items: [
      { id: 1, name: "Classic Burger", quantity: 1, price: 14.99 },
      { id: 4, name: "House Wine", quantity: 1, price: 7.99 }
    ],
    total: 22.98,
    timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  }
];

const initialKitchenOrders: KitchenOrder[] = [
  {
    id: 1,
    items: [
      {
        menuItemId: 1,
        name: "Classic Burger",
        quantity: 2,
        status: "preparing",
        startTime: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
        notes: "Medium well"
      }
    ],
    tableNumber: 5,
    priority: "high"
  }
];

export const useOrderState = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>(initialKitchenOrders);

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
