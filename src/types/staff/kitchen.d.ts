
export interface KitchenOrderItem {
  id: number;
  name: string;
  quantity: number;
  notes?: string;
  status: "pending" | "preparing" | "ready" | "delivered";
  menu_item_id: number;
  start_time?: string;
  completion_time?: string;
  cooking_station?: "grill" | "fry" | "salad" | "dessert" | "beverage" | "hot" | "cold";
  assigned_chef?: string;
  modifications?: string[];
  allergen_alert?: boolean;
  allergens?: string[];
  course?: "appetizer" | "main" | "dessert";
}

export interface KitchenOrder {
  id: number;
  order_id: number;
  table_number: number;
  server_name: string;
  items: KitchenOrderItem[];
  status: "pending" | "preparing" | "ready" | "delivered";
  priority: "normal" | "rush" | "high";
  notes?: string;
  created_at: string;
  updated_at: string;
  estimated_delivery_time: string;
  coursing: string;
}

export interface MenuItem {
  id: number;
  name: string;
  category: "appetizer" | "main" | "dessert" | "beverage";
  price: number;
  description: string;
  preparationTime: number;
  allergens: string[];
  available: boolean;
  image?: string;
  orderCount?: number;
  prep_details?: {
    ingredients?: string[];
    equipment_needed?: string[];
    steps?: string[];
    quality_checks?: string[];
    temperature_requirements?: {
      min: number;
      max: number;
      unit: "F" | "C";
    };
  };
}
