
import type { Order, SalesData, MenuItem } from "@/types/staff";

export const calculateDailyMetrics = (orders: Order[], salesData: SalesData[]) => {
  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(order => 
    order.timestamp.startsWith(today)
  );
  
  const todaySales = salesData.find(data => data.date === today);
  
  return {
    orderCount: todayOrders.length,
    totalRevenue: todaySales?.revenue || 0,
    averageOrderValue: todayOrders.length > 0
      ? todayOrders.reduce((sum, order) => sum + order.total, 0) / todayOrders.length
      : 0,
    profit: todaySales?.profit || 0
  };
};

export const calculatePopularItems = (menuItems: MenuItem[]): MenuItem[] => {
  return [...menuItems]
    .sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0))
    .slice(0, 5);
};

export const calculateGrowthMetrics = (salesData: SalesData[]) => {
  if (salesData.length < 2) return { revenueGrowth: 0, orderGrowth: 0 };
  
  const current = salesData[salesData.length - 1];
  const previous = salesData[salesData.length - 2];
  
  return {
    revenueGrowth: ((current.revenue - previous.revenue) / previous.revenue) * 100,
    orderGrowth: ((current.order_count || 0) - (previous.order_count || 0)) / (previous.order_count || 1) * 100
  };
};
