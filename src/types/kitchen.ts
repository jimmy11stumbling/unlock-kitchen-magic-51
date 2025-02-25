
export type KitchenOrderStatus = "pending" | "preparing" | "ready" | "delivered";
export type KitchenOrderPriority = "normal" | "high" | "rush";
export type KitchenCoursing = "standard" | "appetizers first" | "serve together" | "desserts after clearing mains";

export interface KitchenOrderItem {
  menuItemId: number;
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
  estimatedDeliveryTime: string;
  status: KitchenOrderStatus;
  tableNumber?: number;
  serverName?: string;
  createdAt?: string;
  updatedAt?: string;
}
