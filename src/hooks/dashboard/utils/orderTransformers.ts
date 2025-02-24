
import type { Order } from "@/types/staff";
import { DatabaseOrderItem, OrderStatus, SupabaseOrder } from "../types/orderTypes";

export const transformDatabaseOrder = (dbOrder: SupabaseOrder): Order => {
  // First, safely cast items to an array of unknown, then to DatabaseOrderItem[]
  const items = Array.isArray(dbOrder.items) 
    ? (dbOrder.items as unknown as DatabaseOrderItem[]).map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }))
    : [];

  return {
    id: dbOrder.id,
    tableNumber: dbOrder.table_number,
    items,
    status: dbOrder.status as OrderStatus,
    total: dbOrder.total,
    timestamp: dbOrder.timestamp,
    serverName: dbOrder.server_name,
    specialInstructions: dbOrder.special_instructions,
    guestCount: dbOrder.guest_count,
    estimatedPrepTime: dbOrder.estimated_prep_time
  };
};
