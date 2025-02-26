import type { KitchenOrder } from "@/types/staff";

export const initialOrders: KitchenOrder[] = [
  {
    id: 1,
    orderId: 101,
    tableNumber: 5,
    items: [
      {
        menuItemId: 1,
        quantity: 2,
        status: "pending",
        cookingStation: "grill",
        assignedChef: "John Doe",
        modifications: [],
        allergenAlert: false
      }
    ],
    status: "pending",
    priority: "normal",
    estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toISOString()
  }
];
