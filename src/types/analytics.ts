
export interface DailyReport {
  date: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topSellingItems: import('./menu').MenuItem[];
  laborCosts: number;
  inventoryCosts: number;
  netProfit: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  costs: number;
  profit: number;
  order_count?: number;
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
  applicableItems: number[];
  active: boolean;
}
