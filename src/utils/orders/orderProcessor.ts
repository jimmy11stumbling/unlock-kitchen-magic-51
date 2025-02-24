
import type { Order, MenuItem } from "@/types/staff";
import { calculateMetrics } from "../performance/metricsTracker";

export const calculateOrderTotal = (items: MenuItem[], tip: number = 0, taxRate: number = 0.08) => {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * taxRate;
  return {
    subtotal,
    tax,
    tip,
    total: subtotal + tax + tip
  };
};

export const validateOrder = (order: Order): string[] => {
  const errors: string[] = [];
  
  if (!order.tableNumber) errors.push("Table number is required");
  if (!order.items?.length) errors.push("Order must contain at least one item");
  if (order.guestCount < 1) errors.push("Guest count must be at least 1");
  
  return errors;
};

export const orderMetrics = (orders: Order[]) => {
  const totals = orders.map(o => o.total);
  return calculateMetrics(totals);
};
