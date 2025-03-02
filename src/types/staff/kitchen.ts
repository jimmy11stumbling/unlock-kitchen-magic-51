
export interface KitchenOrderItem {
  id: number;
  menuItemId: number;
  name: string;
  quantity: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  cookingStation: string;
  assignedChef?: string;
  modifications?: string[];
  allergenAlert?: boolean;
  startTime?: string;
  completionTime?: string;
  notes?: string;
  allergens?: string[];
  course?: string;
}

export interface KitchenOrder {
  id: number;
  orderId: number;
  tableNumber: number;
  serverName: string;
  items: KitchenOrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  priority: 'normal' | 'rush' | 'high';
  created_at: string;  // Keep these snake_case as they come from database directly
  updated_at: string;  // Keep these snake_case as they come from database directly
  estimatedDeliveryTime: string;
  coursing?: string;
  notes?: string;
}
