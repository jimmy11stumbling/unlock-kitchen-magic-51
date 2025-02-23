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
}

export interface TableLayout {
  id: number;
  number: number;
  capacity: number;
  status: "available" | "occupied" | "reserved" | "cleaning";
  section: "indoor" | "outdoor" | "bar";
  reservationId?: number;
}

export interface DailyReport {
  date: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topSellingItems: MenuItem[];
  laborCosts: number;
  inventoryCosts: number;
  netProfit: number;
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
  }[];
  priority: "normal" | "high" | "rush";
  notes: string;
}

export interface CustomerFeedback {
  id: number;
  orderId: number;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  date: string;
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
  applicableItems: number[]; // menuItemIds
  active: boolean;
}

export interface DailySales {
  date: string;
  items: {
    menuItemId: number;
    quantity: number;
    revenue: number;
  }[];
  totalRevenue: number;
}
