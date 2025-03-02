
// If the file already exists, add the following type definition:

export interface StaffDTO {
  id: number;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  status?: string;
  salary?: number;
  hire_date?: string;
  schedule?: string | any;
  certifications?: string[] | string;
  performance_rating?: number;
  notes?: string;
  department?: string;
}

// Basic staff member interfaces
export interface StaffMember {
  id: number;
  name: string;
  role: 'manager' | 'chef' | 'server' | 'bartender' | 'host' | 'kitchen_staff' | 'cleaner';
  email: string;
  phone: string;
  status: StaffStatus;
  salary: number;
  hireDate: string;
  schedule?: any;
  certifications?: string[];
  performanceRating?: number;
  notes?: string;
  department?: string;
  shift?: string;
}

export type StaffStatus = 'active' | 'off_duty' | 'on_break' | 'on_leave' | 'terminated';

// Menu related interfaces
export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage' | string;
  available: boolean;
  allergens?: string[];
  preparationTime?: number;
  orderCount: number;
  image?: string;
}

// Reservation related interfaces
export interface Reservation {
  id: number;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  partySize: number;
  date: string;
  time: string;
  tableNumber?: number;
  status: ReservationStatus;
  notes?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt?: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'seated' | 'completed' | 'no-show';

// Order related interfaces
export interface Order {
  id: number;
  tableNumber: number;
  serverName: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'paid' | 'cancelled';
  total: number;
  timestamp: string;
  guestCount?: number;
  estimatedPrepTime?: number;
  notes?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  category?: string;
  station?: string;
}

// Kitchen related interfaces
export interface KitchenOrder {
  id: number;
  order_id: number;
  items: KitchenOrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  priority: 'low' | 'normal' | 'high' | 'rush';
  created_at: string;
  updated_at: string;
  estimated_delivery_time: string;
  notes?: string;
  coursing?: string;
  tableNumber?: number;
  serverName?: string;
}

export interface KitchenOrderItem {
  id: number;
  menu_item_id: number;
  name: string;
  quantity: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  cooking_station?: string;
  notes?: string;
  start_time?: string;
  completion_time?: string;
  assigned_chef?: string;
  course?: string;
  allergens?: string[];
}

// Table layout interface
export interface TableLayout {
  id: number;
  number: number;
  capacity: number;
  section: string;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  activeOrder: number | null;
  reservationId: number | null;
  shape?: 'rectangle' | 'circle' | 'square';
  position?: { x: number; y: number };
}

// Inventory interface
export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  price: number;
  unit: string;
  supplierId?: number;
  lastOrderDate?: string;
  expiryDate?: string;
  supplier?: string;
}

// Shift interface
export interface Shift {
  id: number;
  staffId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'missed' | 'in_progress';
  notes?: string;
}

// Analytics interfaces
export interface SalesData {
  id: number;
  date: string;
  revenue: number;
  profit: number;
  salesCount: number;
  averageTicketSize?: number;
  topSellingItems?: string[];
}

export interface DailyReport {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  laborCosts: number;
  inventoryCosts: number;
  netProfit: number;
  averageOrderValue: number;
  topSellingItems: {
    id: number;
    name: string;
    category?: string;
    price: number;
    orderCount?: number;
  }[];
  hourlyData?: {
    hour: number;
    orders: number;
    revenue: number;
  }[];
}

// Feedback interface
export interface CustomerFeedback {
  id: number;
  orderId: number;
  date: string;
  rating: number;
  comment: string;
  resolved: boolean;
  customerName?: string;
  tableNumber?: number;
}

// Promotion interface
export interface Promotion {
  id: number;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'bogo';
  discountValue: number;
  startDate: string;
  endDate: string;
  active: boolean;
  applicableItems: number[] | 'all';
  usageLimit?: number;
  usageCount: number;
  code?: string;
}

// Payroll interfaces
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
    federalTax: number;
    stateTax: number;
    medicareTax: number;
    socialSecurityTax: number;
    healthInsurance?: number;
    retirement?: number;
    other?: number;
    tax?: number;
    insurance?: number;
  };
  netPay: number;
  status: 'pending' | 'processing' | 'completed' | 'error' | 'paid';
  totalPay: number;
  paymentDate?: string;
  paymentMethod?: string;
}

export interface PayrollSettings {
  accountType?: string;
  accountNumber?: string;
  routingNumber?: string;
  directDeposit?: boolean;
  federalTaxWithholding?: number;
  stateTaxWithholding?: number;
  healthInsurance?: number;
  retirementContribution?: number;
  otherDeductions?: {
    name: string;
    amount: number;
  }[];
  payFrequency?: 'weekly' | 'biweekly' | 'monthly';
  paymentMethod?: string;
  taxWithholding?: {
    federal: number;
    state: number;
    local: number;
  };
  // Properties used in PayrollSettings component
  taxRate?: number;
  overtimeThreshold?: number;
  overtimeMultiplier?: number;
  paySchedule?: 'weekly' | 'biweekly' | 'monthly';
  deductionRates?: {
    insurance: number;
    retirement: number;
  };
}
