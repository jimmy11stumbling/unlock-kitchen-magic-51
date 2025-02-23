
export interface Order {
  id: number;
  tableNumber: number;
  items: OrderItem[];
  status: "pending" | "preparing" | "ready" | "delivered";
  total: number;
  timestamp: string;
  serverName: string;
  specialInstructions?: string;
  guestCount: number;
  estimatedPrepTime: number;
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: "appetizer" | "main" | "dessert" | "beverage";
  description: string;
  available: boolean;
  image?: string;
  allergens: string[];
  preparationTime: number;
  orderCount?: number;
}

export interface KitchenOrder {
  id: number;
  orderId: number;
  items: {
    menuItemId: number;
    quantity: number;
    status: "pending" | "preparing" | "ready" | "delivered";
    startTime?: string;
    completionTime?: string;
    cookingStation: string;
    assignedChef: string;
    modifications: string[];
    allergenAlert: boolean;
  }[];
  priority: "normal" | "high" | "rush";
  notes: string;
  coursing: "standard" | "appetizers first" | "serve together" | "desserts after clearing mains";
  estimatedDeliveryTime: string;
}
