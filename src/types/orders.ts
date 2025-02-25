
export type OrderStatus = "pending" | "preparing" | "ready" | "delivered";
export type PaymentStatus = "pending" | "completed" | "failed";
export type PaymentMethod = "cash" | "card" | "mobile";

export interface OrderItem {
  id: number;
  menuItemId: number;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: number;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  subtotal: number;
  tax: number;
  tip?: number;
  timestamp: string;
  serverName: string;
  specialInstructions?: string;
  guestCount: number;
  estimatedPrepTime: number;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  customerId?: string;
  loyaltyPointsEarned?: number;
  createdAt?: string;
  updatedAt?: string;
}
