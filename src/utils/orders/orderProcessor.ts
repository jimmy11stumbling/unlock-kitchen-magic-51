
import type { KitchenOrder, KitchenOrderItem } from "@/types/staff";

export const processOrder = (orderId: number) => {
  const items: KitchenOrderItem[] = [
    {
      id: 1,
      name: "Grilled Chicken",
      menuItemId: 1,
      quantity: 2,
      status: "pending",
      cookingStation: "grill",
      assignedChef: "John",
      modifications: [],
      allergenAlert: false,
      notes: ""
    }
  ];

  const kitchenOrder: KitchenOrder = {
    id: orderId,
    orderId,
    tableNumber: 1,
    items,
    status: "pending",
    priority: "normal",
    estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toISOString(),
    createdAt: new Date().toISOString()
  };

  return kitchenOrder;
};
