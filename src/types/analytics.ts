
export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

export interface DailyReport {
  id: number;
  date: string;
  totalRevenue: number;
  orderCount: number;
  netProfit: number;
  averageTicketSize: number;
  topSellingItems: Array<{
    menuItemId: number;
    name: string;
    quantity: number;
    revenue: number;
  }>;
}
