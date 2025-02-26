
import type { Order, KitchenOrder, KitchenOrderItem } from "@/types/staff";

export const processOrder = (order: Order): KitchenOrder => {
  const kitchenItems: KitchenOrderItem[] = order.items.map(item => ({
    menuItemId: Number(item.id),
    quantity: item.quantity,
    status: "pending",
    cookingStation: determineStation(item.name),
    assignedChef: "",
    modifications: [],
    allergenAlert: false
  }));

  return {
    id: Math.floor(Math.random() * 1000),
    orderId: order.id,
    tableNumber: order.tableNumber,
    items: kitchenItems,
    status: "pending",
    priority: "normal",
    estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toISOString()
  };
};

const determineStation = (itemName: string): KitchenOrderItem["cookingStation"] => {
  // Simple logic to determine cooking station
  if (itemName.toLowerCase().includes("salad")) return "salad";
  if (itemName.toLowerCase().includes("drink")) return "beverage";
  if (itemName.toLowerCase().includes("dessert")) return "dessert";
  if (itemName.toLowerCase().includes("fries")) return "fry";
  return "grill"; // default station
};
