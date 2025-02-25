
export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  costs: number;
  profit: number;
  order_count?: number;
  averageOrderValue: number;
}

export interface DailyReport {
  id: number;
  date: string;
  totalRevenue: number;
  totalOrders: number;
  orderCount: number;
  laborCosts: number;
  inventoryCosts: number;
  netProfit: number;
  averageTicketSize: number;
  topSellingItems: Array<{
    menuItemId: number;
    name: string;
    quantity: number;
    revenue: number;
    price: number;
    orderCount: number;
  }>;
}
