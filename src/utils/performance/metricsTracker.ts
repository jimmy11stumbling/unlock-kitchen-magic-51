
// Fix the metrics tracker function issues

export const calculateStaffEfficiency = (orders: any[], staff: any[]) => {
  if (staff.length === 0 || orders.length === 0) return 0;
  
  const completedOrders = orders.filter(order => order.status === 'delivered');
  const avgOrdersPerStaff = completedOrders.length / staff.length;
  const targetOrdersPerStaff = 10; // Configurable target
  
  return Math.min((avgOrdersPerStaff / targetOrdersPerStaff) * 100, 100);
};

export const calculateWeeklyHours = (staffMember: any) => {
  if (!staffMember || !staffMember.schedule) return 0;
  
  // Calculate hours from the schedule
  let totalHours = 0;
  
  Object.entries(staffMember.schedule)
    .filter(([_, time]) => typeof time === 'string' && time !== "OFF")
    .forEach(([_, time]) => {
      if (typeof time !== 'string' || !time.includes("-")) return;
      const [start, end] = time.split("-");
      const startHour = parseInt(start.split(":")[0]);
      const endHour = parseInt(end.split(":")[0]);
      totalHours += (endHour > startHour ? endHour - startHour : 24 - startHour + endHour);
    });
  
  return totalHours;
};

export const calculateAverageOrderValue = (orders: any[]): number => {
  if (!orders || orders.length === 0) return 0;
  
  const totalAmount = orders.reduce((sum, order) => {
    const amount = typeof order.total === 'number' ? order.total : 0;
    return sum + amount;
  }, 0);
  
  return totalAmount / orders.length;
};

export const calculateOrderGrowth = (orders: any[]) => {
  if (!orders || orders.length === 0) return 0;
  
  // Safe calculations avoiding unknown types
  const amountThisMonth = orders
    .filter(order => new Date(order.date).getMonth() === new Date().getMonth())
    .reduce((sum, order) => {
      const amount = typeof order.total === 'number' ? order.total : 0;
      return sum + amount;
    }, 0);
  
  const amountLastMonth = orders
    .filter(order => new Date(order.date).getMonth() === new Date().getMonth() - 1)
    .reduce((sum, order) => {
      const amount = typeof order.total === 'number' ? order.total : 0;
      return sum + amount;
    }, 0);
  
  if (amountLastMonth === 0) return 100;
  return ((amountThisMonth - amountLastMonth) / amountLastMonth) * 100;
};
