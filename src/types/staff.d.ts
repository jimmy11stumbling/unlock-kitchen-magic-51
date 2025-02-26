
export type ReservationStatus = 
  | "pending"
  | "confirmed"
  | "seated"
  | "completed"
  | "cancelled"
  | "no-show";

export interface Reservation {
  id: number;
  customerName: string;
  date: string;
  time: string;
  partySize: number;
  tableNumber: number;
  status: ReservationStatus;
  notes: string;
  phoneNumber?: string;
  email?: string;
  specialRequests?: string;
  assignedServer?: number;
  createdAt: string;
  updatedAt: string;
}

export type StaffStatus = "active" | "on_break" | "off_duty";
export type StaffRole = "manager" | "server" | "chef" | "bartender";

export interface StaffMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: StaffStatus;
  schedule: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  certifications: string[];
  performance_rating: number;
  notes: string;
  department?: string;
  address?: string;
  salary?: number;
  hourlyRate?: number;
  overtimeRate?: number;
  shift?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  bankInfo?: {
    accountNumber: string;
    routingNumber: string;
    accountType: "checking" | "savings";
  };
  payrollSettings?: {
    paymentMethod: "direct_deposit" | "check";
    taxWithholding: number;
    benefits: string[];
  };
}

export interface KitchenOrderItem {
  id: number;
  name: string;
  quantity: number;
  status: "pending" | "preparing" | "ready" | "delivered";
  notes?: string;
  menuItemId: number;
  startTime?: string;
  cookingStation?: string;
  assignedChef?: string;
  modifications?: string[];
  allergenAlert?: boolean;
}

export interface KitchenOrder {
  id: number;
  orderId: number;
  tableNumber: number;
  items: KitchenOrderItem[];
  status: "pending" | "preparing" | "ready" | "delivered";
  priority: "normal" | "rush" | "high";
  estimatedDeliveryTime: string;
  notes?: string;
  createdAt: string;
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
}

export interface Order {
  id: number;
  tableNumber: number;
  serverName: string;
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number;
    notes?: string;
  }[];
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

export interface SalesData {
  date: string;
  revenue: number;
  profit: number;
  costs?: number;
}

export interface DailyReport {
  id: number;
  date: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topSellingItems: Array<MenuItem & { orderCount: number }>;
  laborCosts: number;
  inventoryCosts: number;
  netProfit: number;
}

export interface PaymentTransaction {
  id: number;
  orderId: number;
  amount: number;
  method: "cash" | "card" | "mobile";
  status: "pending" | "completed" | "failed" | "refunded";
  timestamp: string;
}

export interface PayrollEntry {
  id: number;
  staffId: number;
  startDate: string;
  endDate: string;
  regularHours: number;
  overtimeHours: number;
  totalPay: number;
  deductions: number;
  netPay: number;
  status: "pending" | "approved" | "paid";
}

export interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
  type: "system" | "user" | "error";
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
