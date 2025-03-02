
export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: number;
  tableNumber: number;
  serverName: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
  timestamp: string;
  guestCount?: number;
  specialInstructions?: string;
  estimatedPrepTime?: number;
}

export interface TableLayout {
  id: number;
  number: number;
  capacity: number;
  status: "available" | "occupied" | "reserved" | "cleaning";
  section: "indoor" | "outdoor" | "bar";
  coordinates?: { x: number; y: number };
  activeOrder: number | null;
  server?: number;
}

export interface PaymentTransaction {
  id: number;
  orderId: number;
  amount: number;
  method: "cash" | "card" | "mobile";
  status: "pending" | "completed" | "failed" | "refunded";
  timestamp: string;
}
