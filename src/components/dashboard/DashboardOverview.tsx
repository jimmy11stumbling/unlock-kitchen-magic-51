import { Order, SalesData, MenuItem, Reservation, InventoryItem } from "@/types";
import { DateRangeSelector } from "./DateRangeSelector";
import { useState, useEffect } from "react";
import { KeyMetrics } from "./overview/KeyMetrics";
import { RevenueChart } from "./overview/RevenueChart";
import { OrdersChart } from "./overview/OrdersChart";
import { AlertsPanel } from "./overview/AlertsPanel";
import { TopSellingItems } from "./overview/TopSellingItems";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import type { StaffMember } from "@/types/staff";

interface DashboardOverviewProps {
  salesData: SalesData[];
  staff: StaffMember[];
  orders: Order[];
  menuItems: MenuItem[];
  reservations: Reservation[];
  inventory: InventoryItem[];
}

export const DashboardOverview = ({
  salesData,
  staff,
  orders,
  menuItems,
  reservations,
  inventory,
}: DashboardOverviewProps) => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [filteredSalesData, setFilteredSalesData] = useState<SalesData[]>(salesData);

  useEffect(() => {
    const filtered = salesData.filter((data) => {
      const date = new Date(data.date);
      if (startDate && date < startDate) return false;
      if (endDate && date > endDate) return false;
      return true;
    });
    setFilteredSalesData(filtered);
  }, [salesData, startDate, endDate]);

  const handleDateRangeChange = (start: Date | undefined, end: Date | undefined) => {
    if (start && end && start > end) {
      toast({
        title: "Invalid date range",
        description: "Start date cannot be after end date",
        variant: "destructive",
      });
      return;
    }
    setStartDate(start);
    setEndDate(end);
  };

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <div className="w-full sm:w-auto">
          <DateRangeSelector
            startDate={startDate}
            endDate={endDate}
            onRangeChange={handleDateRangeChange}
          />
        </div>
      </div>

      <KeyMetrics 
        salesData={filteredSalesData}
        staff={staff}
        orders={orders}
        reservations={reservations}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart data={filteredSalesData} />
        <OrdersChart data={filteredSalesData} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AlertsPanel 
          inventory={inventory}
          reservations={reservations}
          activeOrders={getActiveOrders()}
          lowStockItems={getLowStockItems()}
          pendingReservations={getPendingReservations()}
        />
        <TopSellingItems menuItems={menuItems} />
      </div>

      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Active Staff</h3>
            <div className="space-y-1">
              {staff
                .filter(member => member.status === "active")
                .map(member => (
                  <div key={member.id} className="flex justify-between items-center">
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
                  <div key={order.id} className="flex justify-between items-center">
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
                  <div key={res.id} className="flex justify-between items-center">
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
  );
};
