
import { SearchBar } from "./SearchBar";
import { DateRangeSelector } from "./DateRangeSelector";
import { useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import { KeyMetrics } from "./overview/KeyMetrics";
import { RevenueChart } from "./overview/RevenueChart";
import { OrdersChart } from "./overview/OrdersChart";
import { AlertsPanel } from "./overview/AlertsPanel";
import { TopSellingItems } from "./overview/TopSellingItems";
import type { StaffMember, Order, SalesData, MenuItem, Reservation, InventoryItem } from "@/types/staff";

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
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  
  const { searchQuery, setSearchQuery, filteredItems: filteredStaff } = useSearch(staff, ['name', 'role']);

  const filteredSalesData = salesData.filter((data) => {
    const date = new Date(data.date);
    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search staff, menu items, or orders..."
        />
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          onRangeChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
      </div>

      <KeyMetrics 
        salesData={filteredSalesData}
        staff={filteredStaff}
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
        />
        <TopSellingItems menuItems={menuItems} />
      </div>
    </div>
  );
};
