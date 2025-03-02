
export interface KitchenOrderItem {
  id: number;
  menuItemId: number;
  name: string;
  quantity: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  cookingStation: 'grill' | 'fry' | 'salad' | 'dessert' | 'beverage' | 'hot' | 'cold';
  assignedChef: string;
  modifications: string[];
  allergenAlert: boolean;
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
  priority: 'normal' | 'high' | 'rush';
  notes?: string;
  estimatedDeliveryTime: string;
  startTime?: string;
  completionTime?: string;
  created_at: string;
  updated_at: string;
  coursing?: string;
}
