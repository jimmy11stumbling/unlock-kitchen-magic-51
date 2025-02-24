export type StaffRole = 'manager' | 'chef' | 'server' | 'host' | 'bartender';
export type StaffStatus = 'active' | 'on_break' | 'off_duty';

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
  deductions: {
    tax: number;
    insurance: number;
    retirement: number;
    other: number;
  };
  netPay: number;
  status: 'pending' | 'processed' | 'paid';
  paymentDate: string;
  paymentMethod: 'direct_deposit' | 'check';
  checkNumber?: string;
}

export interface PayStub {
  id: number;
  payrollEntryId: number;
  staffId: number;
  generatedDate: string;
  documentUrl: string;
}

export interface PayrollSettings {
  payPeriod: 'weekly' | 'biweekly' | 'monthly';
  paymentMethod: 'direct_deposit' | 'check';
  taxWithholding: {
    federal: number;
    state: number;
    local: number;
  };
  benefits: {
    insurance: number;
    retirement: number;
  };
}

export interface StaffMember {
  id: number;
  name: string;
  role: StaffRole;
  status: StaffStatus;
  shift: string;
  salary: number;
  hourlyRate?: number;
  overtimeRate?: number;
  email: string;
  phone: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  startDate: string;
  department: string;
  certifications: string[];
  performanceRating: number;
  notes: string;
  schedule: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  bankInfo: {
    accountNumber: string;
    routingNumber: string;
    accountType: "checking" | "savings";
  };
  payrollSettings?: PayrollSettings;
  taxInfo?: {
    ssn: string;
    w4Status: string;
    allowances: number;
    additionalWithholding: number;
  };
}

export interface Message {
  role: "user" | "assistant";
  content: string;
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
  category: string;
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
  order_count?: number;
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
  orderCount?: number;
}

export interface TableLayout {
  id: number;
  number: number;
  capacity: number;
  status: "available" | "occupied" | "reserved" | "cleaning";
  section: "indoor" | "outdoor" | "bar";
  reservationId?: number;
  activeOrder: number | null;
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
