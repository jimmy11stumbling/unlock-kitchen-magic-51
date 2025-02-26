
export interface KitchenOrderItem {
  menuItemId: number;
  quantity: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  cookingStation: 'grill' | 'fry' | 'salad' | 'dessert' | 'beverage' | 'hot' | 'cold';
  assignedChef: string;
  modifications: string[];
  allergenAlert: boolean;
  startTime?: string;
  completionTime?: string;
}

export interface KitchenOrder {
  id: number;
  orderId: number;
  tableNumber: number;
  items: KitchenOrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  priority: 'normal' | 'high' | 'rush';
  notes?: string;
  estimatedDeliveryTime: string;
  startTime?: string;
  completionTime?: string;
}
