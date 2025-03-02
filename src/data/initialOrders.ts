import type { KitchenOrderItem, KitchenOrder } from "@/types/staff";

export const getInitialKitchenOrders = () => {
  const items: KitchenOrderItem[] = [
    {
      id: 1,
      menu_item_id: 1,
      name: "Classic Burger",
      quantity: 2,
      status: "pending",
      cooking_station: "grill",
      notes: "Medium well"
    },
    {
      id: 2,
      menu_item_id: 2,
      name: "Fries",
      quantity: 1,
      status: "pending",
      cooking_station: "fryer",
      notes: "Extra crispy"
    },
    {
      id: 3,
      menu_item_id: 3,
      name: "Pizza",
      quantity: 1,
      status: "pending",
      cooking_station: "oven",
      notes: "No olives"
    },
    {
      id: 4,
      menu_item_id: 4,
      name: "Salad",
      quantity: 1,
      status: "pending",
      cooking_station: "prep",
      notes: "Extra dressing"
    }
  ];

  const orders: KitchenOrder[] = [
    {
      id: 1,
      order_id: 101,
      tableNumber: 5,
      serverName: "Miguel",
      items,
      status: "pending",
      priority: "normal",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      estimated_delivery_time: new Date(Date.now() + 25 * 60000).toISOString(),
      coursing: "standard"
    }
  ];

  return { orders, items };
};
