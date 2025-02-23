
export interface StaffMember {
  id: number;
  name: string;
  role: string;
  status: "active" | "on_break" | "off_duty";
  shift: string;
  salary: string;
}

export interface Shift {
  id: number;
  staffId: number;
  date: string;
  time: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  price: number;
}

export interface Order {
  id: number;
  tableNumber: number;
  items: OrderItem[];
  status: "pending" | "preparing" | "ready" | "delivered";
  total: number;
  timestamp: string;
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Reservation {
  id: number;
  customerName: string;
  date: string;
  time: string;
  partySize: number;
  tableNumber: number;
  status: "confirmed" | "pending" | "cancelled";
  notes?: string;
}

export interface SalesData {
  date: string;
  revenue: number;
  costs: number;
  profit: number;
}

export interface PaymentTransaction {
  id: number;
  orderId: number;
  amount: number;
  method: "cash" | "credit" | "debit";
  status: "completed" | "pending" | "failed";
  timestamp: string;
}
