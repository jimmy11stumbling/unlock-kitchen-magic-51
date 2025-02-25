import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AlertsPanel } from "./overview/AlertsPanel";
import { KeyMetrics } from "./overview/KeyMetrics";
import { RevenueChart } from "./overview/RevenueChart";
import { OrdersChart } from "./overview/OrdersChart";
import { TopSellingItems } from "./overview/TopSellingItems";
import { InventoryItem, Order, Reservation } from "@/types";

export const DashboardOverview = ({ 
  salesData,
  staff,
  orders,
  inventory,
  reservations,
  menuItems 
}) => {
  const lowStockItems = inventory.filter(item => item.quantity <= item.minQuantity);
  const pendingReservations = reservations.filter(r => r.status === "pending");
  const activeOrders = orders.filter(o => o.status === "pending" || o.status === "preparing");

  return (
    <div className="space-y-6">
      <KeyMetrics 
        salesData={salesData}
        staff={staff}
        orders={orders}
        reservations={reservations}
      />
      <AlertsPanel
        inventory={inventory}
        reservations={reservations}
        orders={orders}
        lowStockItems={lowStockItems}
        pendingReservations={pendingReservations}
      />
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <RevenueChart data={salesData} />
        <OrdersChart data={salesData} />
      </div>
      <TopSellingItems menuItems={menuItems} />
    </div>
  );
};
