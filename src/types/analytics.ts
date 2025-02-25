
export interface DailyReport {
  date: string;
  totalRevenue: number;
  totalOrders: number;
  laborCosts: number;
  inventoryCosts: number;
  netProfit: number;
  topSellingItems: MenuItem[];
  staffPerformance: {
    staffId: number;
    ordersProcessed: number;
    averageOrderTime: number;
  }[];
}

export interface SalesData {
  date: string;
  revenue: number;
  orderCount: number;
  averageOrderValue: number;
  peakHours: {
    hour: number;
    orders: number;
  }[];
  categoryBreakdown: {
    [key: string]: number;
  };
}
