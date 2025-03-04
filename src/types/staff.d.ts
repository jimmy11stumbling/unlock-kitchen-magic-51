
// Staff-related Types
export interface StaffMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  avatar?: string;
  permissions: string[];
  notes?: string;
  schedule?: DailySchedule[];
}

export interface DailySchedule {
  day: string;
  shifts: Shift[];
}

export interface Shift {
  start: string;
  end: string;
  role: string;
  location?: string;
}

// Inventory-related Types
export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  supplier: string;
  minQuantity: number;
  lastRestocked: string;
  expiryDate?: string;
  location?: string;
  notes?: string;
  image?: string;
}

export interface InventoryTransaction {
  id: number;
  itemId: number;
  type: 'restock' | 'usage' | 'waste' | 'adjustment';
  quantity: number;
  date: string;
  staffId: number;
  notes?: string;
}

// Menu-related Types
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage' | string;
  available: boolean;
  image?: string;
  allergens: string[];
  nutritionalInfo?: NutritionalInfo;
  preparationTime: number;
  ingredients: Ingredient[];
  popularity?: number;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface MenuCategory {
  id: number;
  name: string;
  description?: string;
  image?: string;
  order: number;
  items: MenuItem[];
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  allergens: string[];
}

export interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

// Order-related Types
export interface Order {
  id: number;
  tableNumber: number;
  serverName: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  timestamp: string;
  guestCount: number;
  estimatedPrepTime: number;
  specialInstructions?: string;
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
}

export type OrderStatus = 'pending' | 'in-progress' | 'ready' | 'delivered' | 'completed' | 'cancelled';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  modifiers?: string[];
  status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
}

// Kitchen-related Types
export interface KitchenOrder {
  id: number;
  tableNumber: number;
  serverName: string;
  status: string;
  timestamp: string;
  estimatedPrepTime: number;
  specialInstructions?: string;
  items: KitchenOrderItem[];
}

export interface KitchenOrderItem {
  name: string;
  quantity: number;
  status: 'pending' | 'cooking' | 'ready' | 'delivered' | 'cancelled';
  modifications?: string[];
  notes?: string;
}

// Table-related Types
export interface TableData {
  id: number;
  section: string;
  capacity: number;
  status: TableStatus;
  reservation?: string;
  orderId?: number;
  lastOrderTime?: string;
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'dirty' | 'maintenance';

// Reservation-related Types
export interface Reservation {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  time: string;
  partySize: number;
  tableId?: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no-show';
  notes?: string;
  specialRequests?: string;
}

// Analytics-related Types
export interface SalesData {
  date: string;
  revenue: number;
  orderCount: number;
  averageOrderValue: number;
  topSellingItems: TopSellingItem[];
  profit: number;
}

export interface TopSellingItem {
  id: number;
  name: string;
  quantity: number;
  revenue: number;
}

export interface DailyReport {
  id: number;
  date: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  laborCosts: number;
  inventoryCosts: number;
  otherExpenses: number;
  netProfit: number;
  topSellingItems: {
    name: string;
    orderCount: number;
    price: number;
  }[];
  staffPerformance: {
    staffId: number;
    name: string;
    ordersHandled: number;
    salesAmount: number;
  }[];
  notes?: string;
}

// Feedback and Review Types
export interface CustomerFeedback {
  id: number;
  customerId?: number;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  category: 'food' | 'service' | 'ambience' | 'general';
  resolved: boolean;
  responseDate?: string;
  response?: string;
}

export interface FeedbackSummary {
  averageRating: number;
  totalReviews: number;
  categories: {
    name: string;
    averageRating: number;
    totalReviews: number;
  }[];
  recent: CustomerFeedback[];
}

// Vendors and Suppliers Types
export interface Vendor {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  categories: string[];
  rating: number;
  notes?: string;
  paymentTerms: string;
  lastOrderDate?: string;
  active: boolean;
}

// Promotion Types
export interface Promotion {
  id: number;
  name: string;
  description: string;
  type: 'discount' | 'bogo' | 'special' | 'happy-hour';
  startDate: string;
  endDate: string;
  discountValue?: number;
  discountType?: 'percentage' | 'fixed';
  applicableItems?: number[]; // Menu item IDs
  minimumOrderValue?: number;
  code?: string;
  active: boolean;
  usageCount: number;
  redemptionLimit?: number;
}
