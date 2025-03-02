
export interface SalesData {
  id?: number;
  date: string;
  totalSales: number;
  profit: number;
  customerCount: number;
  avgOrderValue: number;
  revenue: number;
  costs: number;
  topSellingCategories?: {
    category: string;
    sales: number;
    percentOfTotal: number;
  }[];
}

export interface DailyReport {
  id?: number;
  date: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topSellingItems: {
    id: number;
    name: string;
    price: number;
    category: string;
    description: string;
    available: boolean;
    allergens: string[];
    preparationTime: number;
    orderCount?: number;
  }[];
  laborCosts: number;
  inventoryCosts: number;
  netProfit: number;
}

export interface CustomerFeedback {
  id: number;
  customerId: number;
  customerName: string;
  orderId: number;
  rating: number;
  comment: string;
  date: string;
  resolved: boolean;
}

export interface Promotion {
  id: number;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'bogo';
  discountValue: number;
  startDate: string;
  endDate: string;
  active: boolean;
  applicableItems: string[];
  minimumPurchase?: number;
  usageLimit?: number;
  usageCount: number;
}
