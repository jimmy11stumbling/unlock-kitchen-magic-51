
export interface KitchenOrderItem {
  id: number;
  menuItemId: number;
  menu_item_id?: number; // For backward compatibility
  name: string;
  quantity: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  cookingStation: string;
  cooking_station?: string; // For backward compatibility
  assignedChef?: string;
  assigned_chef?: string; // For backward compatibility
  modifications?: string[];
  allergenAlert?: boolean;
  allergen_alert?: boolean; // For backward compatibility
  startTime?: string;
  start_time?: string; // For backward compatibility
  completionTime?: string;
  completion_time?: string; // For backward compatibility
  notes?: string;
  allergens?: string[];
  course?: string;
}

export interface KitchenOrder {
  id: number;
  orderId: number;
  order_id?: number; // For backward compatibility
  tableNumber: number;
  table_number?: number; // For backward compatibility
  serverName: string;
  server_name?: string; // For backward compatibility
  items: KitchenOrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  priority: 'normal' | 'rush' | 'high';
  created_at: string;  // Keep these snake_case as they come from database directly
  updated_at: string;  // Keep these snake_case as they come from database directly
  estimatedDeliveryTime: string;
  estimated_delivery_time?: string; // For backward compatibility
  coursing?: string;
  notes?: string;
}
