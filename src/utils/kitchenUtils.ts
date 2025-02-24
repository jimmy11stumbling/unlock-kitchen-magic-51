
import type { Order, MenuItem } from "@/types/staff";

export const estimatePrepTime = (items: MenuItem[]): number => {
  return items.reduce((total, item) => total + (item.preparationTime || 15), 0);
};

export const prioritizeOrders = (orders: Order[]): Order[] => {
  return [...orders].sort((a, b) => {
    // VIP orders get highest priority
    if (a.specialInstructions?.includes('VIP') && !b.specialInstructions?.includes('VIP')) return -1;
    if (!a.specialInstructions?.includes('VIP') && b.specialInstructions?.includes('VIP')) return 1;
    
    // Then sort by estimated prep time
    return (a.estimatedPrepTime || 0) - (b.estimatedPrepTime || 0);
  });
};

export const checkAllergies = (items: MenuItem[]): string[] => {
  return Array.from(new Set(items.flatMap(item => item.allergens || [])));
};
