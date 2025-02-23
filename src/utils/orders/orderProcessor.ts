
import type { Order, MenuItem, KitchenOrder } from "@/types/staff";

export const calculateOrderTotal = (items: Order['items']) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const estimatePreparationTime = (
  items: Order['items'],
  menuItems: MenuItem[]
): number => {
  const itemPrepTimes = items.map(item => {
    const menuItem = menuItems.find(m => m.id === item.id);
    return ((menuItem?.preparationTime || 15) * item.quantity);
  });

  return Math.max(...itemPrepTimes);
};

export const validateOrderItems = (
  items: Order['items'],
  menuItems: MenuItem[]
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  for (const item of items) {
    const menuItem = menuItems.find(m => m.id === item.id);
    
    if (!menuItem) {
      errors.push(`Menu item not found: ${item.name}`);
      continue;
    }

    if (!menuItem.available) {
      errors.push(`Item not available: ${item.name}`);
    }

    if (item.quantity <= 0) {
      errors.push(`Invalid quantity for item: ${item.name}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const createKitchenOrder = (
  order: Order,
  menuItems: MenuItem[]
): KitchenOrder => {
  return {
    id: order.id,
    orderId: order.id,
    items: order.items.map(item => ({
      menuItemId: item.id,
      quantity: item.quantity,
      status: "pending",
      cookingStation: menuItems.find(m => m.id === item.id)?.category === "main" ? "hot" : "cold",
      assignedChef: "",
      modifications: [],
      allergenAlert: menuItems.find(m => m.id === item.id)?.allergens.length > 0
    })),
    priority: order.estimatedPrepTime > 30 ? "high" : "normal",
    notes: order.specialInstructions || "",
    coursing: "standard",
    estimatedDeliveryTime: new Date(
      Date.now() + (order.estimatedPrepTime * 60 * 1000)
    ).toISOString(),
  };
};
