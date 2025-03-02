
import { KitchenOrder, KitchenOrderItem, Order } from "@/types/staff";

export function createKitchenOrderItems(orderItems: Order['items']): KitchenOrderItem[] {
  return orderItems.map((item, index) => ({
    id: index + 1,
    menuItemId: item.id,
    name: item.name, 
    quantity: item.quantity,
    status: "pending",
    cookingStation: item.station || "main",
    notes: item.notes || ""
  }));
}

export function createKitchenOrder(order: Order): KitchenOrder {
  return {
    id: Math.floor(Math.random() * 10000),
    orderId: order.id,
    tableNumber: order.tableNumber,
    serverName: order.serverName,
    items: createKitchenOrderItems(order.items),
    status: "pending",
    priority: "normal",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    estimatedDeliveryTime: new Date(Date.now() + (30 * 60000)).toISOString(),
    coursing: "standard"
  };
}
