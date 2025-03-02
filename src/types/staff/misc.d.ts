
export interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
  type: "system" | "user" | "error";
  role?: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  minQuantity: number;
  price: number;
  supplier: string;
  lastRestocked: string;
}

export interface CustomerFeedback {
  id: number;
  orderId: number;
  date: string;
  rating: number;
  comment: string;
  resolved: boolean;
}

export interface Promotion {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  applicableItems: number[];
  active: boolean;
}
