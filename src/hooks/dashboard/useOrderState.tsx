
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Order, KitchenOrder } from "@/types/staff";

const initialOrders: Order[] = [
  {
    id: 1,
    tableNumber: 5,
    status: "pending",
    items: [
      { id: 1, name: "Truffle Wagyu Burger", quantity: 2, price: 24.99 },
      { id: 3, name: "Lobster Bisque", quantity: 1, price: 16.99 },
      { id: 6, name: "Signature Martini", quantity: 2, price: 15.99 }
    ],
    total: 98.95,
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    tableNumber: 3,
    status: "preparing",
    items: [
      { id: 7, name: "Seafood Paella", quantity: 2, price: 34.99 },
      { id: 4, name: "Tuna Tartare", quantity: 1, price: 19.99 },
      { id: 5, name: "Crème Brûlée", quantity: 2, price: 12.99 }
    ],
    total: 115.95,
    timestamp: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 3,
    tableNumber: 7,
    status: "ready",
    items: [
      { id: 2, name: "Mediterranean Quinoa Bowl", quantity: 1, price: 18.99 },
      { id: 8, name: "Chocolate Soufflé", quantity: 2, price: 14.99 }
    ],
    total: 48.97,
    timestamp: new Date(Date.now() - 3600000).toISOString()
  }
];

const initialKitchenOrders: KitchenOrder[] = [
  {
    id: 1,
    orderId: 1,
    items: [
      {
        menuItemId: 1,
        quantity: 2,
        status: "preparing",
        startTime: new Date(Date.now() - 900000).toISOString(),
      },
      {
        menuItemId: 3,
        quantity: 1,
        status: "pending",
        startTime: new Date(Date.now() - 600000).toISOString(),
      }
    ],
    priority: "high",
    notes: "Burger temperature: 1 medium-rare, 1 medium well. Extra truffle aioli on the side."
  },
  {
    id: 2,
    orderId: 2,
    items: [
      {
        menuItemId: 7,
        quantity: 2,
        status: "preparing",
        startTime: new Date(Date.now() - 1200000).toISOString(),
      },
      {
        menuItemId: 4,
        quantity: 1,
        status: "ready",
        startTime: new Date(Date.now() - 1500000).toISOString(),
        completionTime: new Date(Date.now() - 900000).toISOString(),
      },
      {
        menuItemId: 5,
        quantity: 2,
        status: "pending",
        startTime: new Date(Date.now() - 300000).toISOString(),
      }
    ],
    priority: "rush",
    notes: "Seafood allergy at table - ensure no cross-contamination with shellfish. Extra crispy rice on bottom of paella."
  },
  {
    id: 3,
    orderId: 3,
    items: [
      {
        menuItemId: 2,
        quantity: 1,
        status: "ready",
        startTime: new Date(Date.now() - 1800000).toISOString(),
        completionTime: new Date(Date.now() - 1200000).toISOString(),
      },
      {
        menuItemId: 8,
        quantity: 2,
        status: "preparing",
        startTime: new Date(Date.now() - 900000).toISOString(),
      }
    ],
    priority: "normal",
    notes: "Quinoa bowl: no feta, extra vegetables. Soufflé: one regular, one gluten-free."
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
