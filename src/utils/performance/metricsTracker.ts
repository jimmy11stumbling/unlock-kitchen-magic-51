
import type { Order, StaffMember, MenuItem } from "@/types/staff";

export interface PerformanceMetrics {
  orderCompletionRate: number;
  averagePreparationTime: number;
  customerSatisfactionScore: number;
  revenuePerHour: number;
}

export const calculateStaffPerformance = (
  staff: StaffMember,
  orders: Order[],
  timeframe: { start: Date; end: Date }
): PerformanceMetrics => {
  const staffOrders = orders.filter(
    order => 
      order.serverName === staff.name &&
      new Date(order.timestamp) >= timeframe.start &&
      new Date(order.timestamp) <= timeframe.end
  );

  const completedOrders = staffOrders.filter(
    order => order.status === "delivered"
  );

  const orderCompletionRate = staffOrders.length > 0
    ? (completedOrders.length / staffOrders.length) * 100
    : 0;

  const averagePreparationTime = staffOrders.length > 0
    ? staffOrders.reduce((sum, order) => sum + order.estimatedPrepTime, 0) / staffOrders.length
    : 0;

  const totalRevenue = staffOrders.reduce((sum, order) => sum + order.total, 0);
  const hoursWorked = calculateHoursWorked(staff, timeframe);
  const revenuePerHour = hoursWorked > 0 ? totalRevenue / hoursWorked : 0;

  return {
    orderCompletionRate,
    averagePreparationTime,
    customerSatisfactionScore: staff.performanceRating,
    revenuePerHour
  };
};

const calculateHoursWorked = (
  staff: StaffMember,
  timeframe: { start: Date; end: Date }
): number => {
  // Implementation would calculate actual hours worked based on schedule
  // This is a simplified version
  return 40; // Assuming a standard work week
};

export const trackMenuItemPerformance = (
  menuItem: MenuItem,
  orders: Order[],
  timeframe: { start: Date; end: Date }
) => {
  const relevantOrders = orders.filter(
    order => 
      new Date(order.timestamp) >= timeframe.start &&
      new Date(order.timestamp) <= timeframe.end
  );

  const orderCount = relevantOrders.reduce((count, order) => {
    const itemInOrder = order.items.find(item => item.id === menuItem.id);
    return count + (itemInOrder?.quantity || 0);
  }, 0);

  const revenue = relevantOrders.reduce((total, order) => {
    const itemInOrder = order.items.find(item => item.id === menuItem.id);
    return total + ((itemInOrder?.quantity || 0) * menuItem.price);
  }, 0);

  return {
    orderCount,
    revenue,
    averageOrdersPerDay: orderCount / ((timeframe.end.getTime() - timeframe.start.getTime()) / (1000 * 60 * 60 * 24))
  };
};
