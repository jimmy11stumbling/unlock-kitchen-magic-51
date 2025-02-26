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

export interface StaffMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "manager" | "server" | "chef" | "bartender";
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
  status: "active" | "inactive";
  performance_rating: number;
  notes: string;
}

export interface Shift {
  id: number;
  staffId: number;
  date: string;
  time: string;
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
}

export interface KitchenOrder {
  id: number;
  tableNumber: number;
  items: {
    id: number;
    name: string;
    quantity: number;
    status: "pending" | "preparing" | "ready" | "delivered";
    notes?: string;
  }[];
  status: "pending" | "preparing" | "ready" | "delivered";
  estimatedDeliveryTime: string;
  priority: "normal" | "rush" | "high";
  createdAt: string;
}

export interface CustomerFeedback {
  id: number;
  orderId: number;
  date: string;
  rating: number;
  comment: string;
  resolved: boolean;
}

export interface SalesData {
  date: string;
  revenue: number;
  profit: number;
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
