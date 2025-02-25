
export type KitchenOrderStatus = "pending" | "preparing" | "ready" | "delivered";
export type KitchenOrderPriority = "normal" | "rush" | "high";
export type KitchenCoursing = "standard" | "appetizers first" | "serve together";

export interface KitchenOrderItem {
  menuItemId: number;
  itemName: string;
  quantity: number;
  status: KitchenOrderStatus;
  startTime?: string;
  completionTime?: string;
  cookingStation: string;
  assignedChef: string;
  modifications: string[];
  allergenAlert: boolean;
}

export interface KitchenOrder {
  id: number;
  orderId: number;
  items: KitchenOrderItem[];
  priority: KitchenOrderPriority;
  notes: string;
  coursing: KitchenCoursing;
  created_at: string;
  updated_at: string;
  estimated_delivery_time: string;
  table_number: number;
  server_name: string;
  status: KitchenOrderStatus;
}

export interface Ingredient {
  id: number;
  name: string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
}
