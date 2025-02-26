
import type { KitchenOrder } from "@/types/staff";

export const initialKitchenOrders: KitchenOrder[] = [
  {
    id: 1,
    order_id: 101,
    table_number: 5,
    server_name: "John Doe",
    status: "pending",
    items: [
      {
        id: 1,
        menu_item_id: 1,
        name: "Classic Burger",
        quantity: 2,
        status: "pending",
        cooking_station: "grill",
        notes: "Medium well"
      }
    ],
    priority: "normal",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    estimated_delivery_time: new Date(Date.now() + 30 * 60000).toISOString(),
    coursing: "standard"
  }
];
