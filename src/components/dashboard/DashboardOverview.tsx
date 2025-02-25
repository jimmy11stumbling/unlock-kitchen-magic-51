import { KeyMetrics } from "./overview/KeyMetrics";
import { RevenueChart } from "./overview/RevenueChart";
import { OrdersChart } from "./overview/OrdersChart";
import { TopSellingItems } from "./overview/TopSellingItems";
import { AlertsPanel } from "./overview/AlertsPanel";
import type { StaffMember, SalesData, Order, Reservation, MenuItem } from '@/types';

interface DashboardOverviewProps {
  staff: StaffMember[];
  salesData: SalesData[];
  orders: Order[];
  reservations: Reservation[];
  menuItems: MenuItem[];
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  staff,
  salesData,
  orders,
  reservations,
  menuItems
}) => {
  const lowStockItems = [];
  const pendingReservations = reservations.filter(r => r.status === 'pending');
  const activeOrders = orders.filter(order => order.status === 'pending' || order.status === 'preparing');

  return (
    <div className="container mx-auto p-4 max-w-[1920px]">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <KeyMetrics
          salesData={salesData}
          staff={staff}
          orders={orders}
          reservations={reservations}
        />
        <AlertsPanel
          lowStockItems={lowStockItems}
          pendingReservations={pendingReservations}
          activeOrders={activeOrders}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <RevenueChart data={salesData} />
        <OrdersChart data={salesData} />
      </div>
      <TopSellingItems menuItems={menuItems} />
    </div>
  );
};
