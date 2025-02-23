
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Order, KitchenOrder, MenuItem } from "@/types/staff";

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Truffle Wagyu Burger",
    price: 24.99,
    category: "main",
    description: "Premium wagyu beef patty with truffle aioli",
    available: true,
    allergens: ["dairy", "gluten"],
    preparationTime: 20,
    orderCount: 0
  },
  // ... Add other menu items as needed
];

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
    timestamp: new Date().toISOString(),
    serverName: "Sofia Chen",
    specialInstructions: "Allergy Alert: Guest has dairy sensitivity",
    guestCount: 4,
    estimatedPrepTime: 35
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
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    serverName: "James Wilson",
    specialInstructions: "VIP Guest - Owner's family",
    guestCount: 2,
    estimatedPrepTime: 45
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
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    serverName: "Maria Garcia",
    specialInstructions: "Gluten-free preparation required",
    guestCount: 3,
    estimatedPrepTime: 25
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
        cookingStation: "grill",
        assignedChef: "Isabella Martinez",
        modifications: [
          "1x Medium Rare",
          "1x Medium Well",
          "Extra truffle aioli on side"
        ],
        allergenAlert: true
      },
      {
        menuItemId: 3,
        quantity: 1,
        status: "pending",
        startTime: new Date(Date.now() - 600000).toISOString(),
        cookingStation: "soup",
        assignedChef: "James Wilson",
        modifications: ["Extra garnish"],
        allergenAlert: true
      }
    ],
    priority: "high",
    notes: "Dairy sensitivity - use dairy-free alternatives where possible",
    coursing: "appetizers first",
    estimatedDeliveryTime: new Date(Date.now() + 1200000).toISOString()
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
        cookingStation: "hot-line",
        assignedChef: "Isabella Martinez",
        modifications: ["Extra crispy rice"],
        allergenAlert: true
      },
      {
        menuItemId: 4,
        quantity: 1,
        status: "ready",
        startTime: new Date(Date.now() - 1500000).toISOString(),
        completionTime: new Date(Date.now() - 900000).toISOString(),
        cookingStation: "cold-line",
        assignedChef: "James Wilson",
        modifications: [],
        allergenAlert: false
      },
      {
        menuItemId: 5,
        quantity: 2,
        status: "pending",
        startTime: new Date(Date.now() - 300000).toISOString(),
        cookingStation: "pastry",
        assignedChef: "Maria Garcia",
        modifications: [],
        allergenAlert: false
      }
    ],
    priority: "rush",
    notes: "VIP - Owner's family. Ensure perfect presentation.",
    coursing: "serve together",
    estimatedDeliveryTime: new Date(Date.now() + 900000).toISOString()
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
        cookingStation: "cold-line",
        assignedChef: "James Wilson",
        modifications: ["No feta", "Extra vegetables"],
        allergenAlert: false
      },
      {
        menuItemId: 8,
        quantity: 2,
        status: "preparing",
        startTime: new Date(Date.now() - 900000).toISOString(),
        cookingStation: "pastry",
        assignedChef: "Maria Garcia",
        modifications: ["1x Regular", "1x Gluten-free"],
        allergenAlert: true
      }
    ],
    priority: "normal",
    notes: "Gluten-free soufflé must be prepared in separate area",
    coursing: "desserts after clearing mains",
    estimatedDeliveryTime: new Date(Date.now() + 600000).toISOString()
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
    
    const estimatedPrepTime = Math.max(
      ...order.items.map(item => {
        const menuItem = menuItems.find(m => m.id === item.id);
        return (menuItem?.preparationTime || 0) * item.quantity;
      })
    );
    
    const newKitchenOrder: KitchenOrder = {
      id: kitchenOrders.length + 1,
      orderId: newOrder.id,
      items: order.items.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        status: "pending",
        startTime: new Date().toISOString(),
        cookingStation: determineStation(item.id),
        assignedChef: assignChef(item.id),
        modifications: [],
        allergenAlert: false
      })),
      priority: determinePriority(order),
      notes: order.specialInstructions || "",
      coursing: "standard",
      estimatedDeliveryTime: new Date(Date.now() + estimatedPrepTime * 60000).toISOString()
    };

    setOrders([...orders, newOrder]);
    setKitchenOrders([...kitchenOrders, newKitchenOrder]);

    toast({
      title: "New order created",
      description: `Order #${newOrder.id} has been sent to kitchen`,
    });
  };

  const determineStation = (itemId: number) => {
    const stationMap: Record<number, string> = {
      1: "grill",
      2: "cold-line",
      3: "soup",
      4: "cold-line",
      5: "pastry",
      6: "bar",
      7: "hot-line",
      8: "pastry"
    };
    return stationMap[itemId] || "misc";
  };

  const assignChef = (itemId: number) => {
    const chefMap: Record<string, string> = {
      "grill": "Isabella Martinez",
      "hot-line": "Isabella Martinez",
      "cold-line": "James Wilson",
      "soup": "James Wilson",
      "pastry": "Maria Garcia",
      "bar": "Alex Thompson"
    };
    return chefMap[determineStation(itemId)] || "Unassigned";
  };

  const determinePriority = (order: Omit<Order, "id" | "timestamp">): KitchenOrder["priority"] => {
    if (order.specialInstructions?.toLowerCase().includes("vip")) return "rush";
    if (order.items.length > 4) return "high";
    return "normal";
  };

  const updateOrderStatus = (orderId: number, status: Order["status"]) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    ));

    if (status === "ready") {
      toast({
        title: "Order Ready",
        description: `Order #${orderId} is ready for service`,
      });
    }
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
                        status === "ready" ? new Date().toISOString() : item.completionTime,
                    }
                  : item
              ),
            }
          : order
      )
    );

    const updatedOrder = kitchenOrders.find(o => o.id === orderId);
    if (updatedOrder && updatedOrder.items.every(item => item.status === "ready")) {
      updateOrderStatus(updatedOrder.orderId, "ready");
    }

    toast({
      title: "Item status updated",
      description: `Item status updated to ${status}`,
      variant: "default"
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
