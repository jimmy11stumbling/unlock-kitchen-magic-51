
import type { KitchenOrder, KitchenOrderItem } from "@/types/staff";

export const createKitchenOrder = (tableNumber: number, items: any[]): KitchenOrder => {
  const kitchenItems: KitchenOrderItem[] = items.map((item, index) => ({
    id: index + 1,
    menu_item_id: item.id,
    name: item.name,
    quantity: item.quantity,
    status: "pending",
    cooking_station: item.station || "grill",
    notes: item.notes
  }));

  const order: KitchenOrder = {
    id: Math.floor(Math.random() * 1000),
    order_id: Math.floor(Math.random() * 1000),
    table_number: tableNumber,
    server_name: "Server",
    items: kitchenItems,
    status: "pending",
    priority: "normal",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    estimated_delivery_time: new Date(Date.now() + 30 * 60000).toISOString(),
    coursing: "standard"
  };

  return order;
};
