
import type { KitchenOrder, KitchenOrderItem } from "@/types/staff";

const initialOrders: KitchenOrder[] = [
  {
    id: 1,
    orderId: 101,
    tableNumber: 5,
    items: [
      {
        id: 1,
        name: "Grilled Chicken",
        menuItemId: 1,
        quantity: 2,
        status: "pending",
        cookingStation: "grill",
        assignedChef: "John",
        modifications: [],
        allergenAlert: false
      }
    ],
    status: "pending",
    priority: "normal",
    estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toISOString(),
    createdAt: new Date().toISOString()
  }
];

export default initialOrders;
