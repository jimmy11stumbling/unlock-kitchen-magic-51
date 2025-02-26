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
export type StaffRole = "manager" | "server" | "chef" | "bartender" | "host";

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
  startDate?: string;
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
    taxWithholding: {
      federal: number;
      state: number;
      local: number;
    };
    benefits: {
      insurance: string;
      retirement: string;
      other: string[];
    };
  };
  payrollEntries?: PayrollEntry[];
}

export interface Shift {
  id: number;
  staffId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "completed" | "cancelled";
}

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
  payPeriodStart: string;
  payPeriodEnd: string;
  regularHours: number;
  overtimeHours: number;
  regularRate: number;
  overtimeRate: number;
  grossPay: number;
  totalPay: number;
  deductions: {
    tax: number;
    insurance: number;
    retirement: number;
    other: number;
  };
  netPay: number;
  status: "pending" | "approved" | "paid";
}

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
