
export interface SalesData {
  date: string;
  revenue: number;
  costs: number;
  profit: number;
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

export interface DailySales {
  date: string;
  items: {
    menuItemId: number;
    quantity: number;
    revenue: number;
  }[];
  totalRevenue: number;
}
