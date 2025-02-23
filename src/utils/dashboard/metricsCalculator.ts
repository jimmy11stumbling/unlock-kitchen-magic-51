
import type { SalesData, Order, MenuItem } from "@/types/staff";

export const calculateRevenueMetrics = (salesData: SalesData[]) => {
  const totalRevenue = salesData.reduce((sum, data) => sum + data.revenue, 0);
  const totalProfit = salesData.reduce((sum, data) => sum + (data.profit || 0), 0);
  const profitMargin = totalRevenue ? (totalProfit / totalRevenue) * 100 : 0;

  return {
    totalRevenue,
    totalProfit,
    profitMargin: profitMargin.toFixed(2),
    averageRevenue: salesData.length ? totalRevenue / salesData.length : 0
  };
};

export const analyzeTopSellingItems = (menuItems: MenuItem[]) => {
  return [...menuItems]
    .sort((a, b) => ((b.orderCount ?? 0) - (a.orderCount ?? 0)))
    .slice(0, 5);
};

export const calculateOrderMetrics = (orders: Order[]) => {
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === "delivered").length;
  const pendingOrders = orders.filter(order => order.status === "pending").length;
  const averagePreparationTime = orders.reduce((sum, order) => sum + order.estimatedPrepTime, 0) / totalOrders;

  return {
    totalOrders,
    completedOrders,
    pendingOrders,
    completionRate: totalOrders ? (completedOrders / totalOrders) * 100 : 0,
    averagePreparationTime
  };
};
