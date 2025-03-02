export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  station?: string;
  notes?: string;
}

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

export interface PaymentTransaction {
  id: number;
  orderId: number;
  amount: number;
  method: "cash" | "credit" | "debit";
  status: "completed" | "pending" | "failed";
  timestamp: string;
}
