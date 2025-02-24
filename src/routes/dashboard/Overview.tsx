
import { Suspense } from "react";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useDataRefresh } from "@/hooks/dashboard/useDataRefresh";
import { KeyMetrics } from "@/components/dashboard/overview/KeyMetrics";
import { RevenueChart } from "@/components/dashboard/overview/RevenueChart";
import { OrdersChart } from "@/components/dashboard/overview/OrdersChart";
import { AlertsPanel } from "@/components/dashboard/overview/AlertsPanel";
import { TopSellingItems } from "@/components/dashboard/overview/TopSellingItems";
import { LoadingState } from "@/components/dashboard/overview/LoadingState";
import { ErrorBoundary } from "@/components/dashboard/overview/ErrorBoundary";
import { NotificationsBulletin } from "@/components/dashboard/overview/NotificationsBulletin";
import { Card } from "@/components/ui/card";

const Overview = () => {
  const { salesData, staff, orders, menuItems, reservations, inventory } = useDashboardState();
  
  useDataRefresh(30000);

  const getActiveOrders = () => orders.filter(order => 
    order.status === "pending" || order.status === "preparing"
  );

  const getLowStockItems = () => inventory.filter(item => 
    item.quantity <= item.minQuantity
  );

  const getPendingReservations = () => reservations.filter(res => 
    res.status === "pending"
  );

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingState />}>
        <div className="space-y-6 animate-fade-in">
          <KeyMetrics 
            salesData={salesData}
            staff={staff}
            orders={orders}
            reservations={reservations}
          />

          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-8 space-y-6">
              <RevenueChart data={salesData} />
              <OrdersChart data={salesData} />
            </div>
            <div className="md:col-span-4">
              <NotificationsBulletin />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-4">
              <AlertsPanel 
                inventory={inventory}
                reservations={reservations}
                activeOrders={getActiveOrders()}
                lowStockItems={getLowStockItems()}
                pendingReservations={getPendingReservations()}
              />
            </div>
            <div className="md:col-span-8">
              <TopSellingItems menuItems={menuItems} />
            </div>
          </div>

          <Card className="p-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Active Staff</h3>
                <div className="space-y-1">
                  {staff
                    .filter(member => member.status === "active")
                    .map(member => (
                      <div key={member.id} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-lg transition-colors">
                        <span>{member.name}</span>
                        <span className="text-sm text-muted-foreground">{member.role}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Recent Orders</h3>
                <div className="space-y-1">
                  {orders
                    .slice(-5)
                    .map(order => (
                      <div key={order.id} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-lg transition-colors">
                        <span>Table {order.tableNumber}</span>
                        <span className="text-sm text-muted-foreground">${order.total}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Upcoming Reservations</h3>
                <div className="space-y-1">
                  {reservations
                    .filter(res => res.status === "confirmed")
                    .slice(0, 5)
                    .map(res => (
                      <div key={res.id} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-lg transition-colors">
                        <span>{res.customerName}</span>
                        <span className="text-sm text-muted-foreground">
                          Table {res.tableNumber}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

export default Overview;
