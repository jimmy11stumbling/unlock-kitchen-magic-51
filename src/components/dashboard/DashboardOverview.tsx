import { Card } from "@/components/ui/card";
import { SearchBar } from "./SearchBar";
import { DateRangeSelector } from "./DateRangeSelector";
import { useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import type { StaffMember, Order, SalesData } from "@/types/staff";

interface DashboardOverviewProps {
  salesData: SalesData[];
  staff: StaffMember[];
  orders: Order[];
}

export const DashboardOverview = ({
  salesData,
  staff,
  orders,
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

  const totalRevenue = filteredSalesData.reduce((sum, data) => sum + data.revenue, 0);
  const totalOrders = orders.length;
  const activeStaff = filteredStaff.filter(member => member.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search staff..."
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

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Revenue</h3>
          <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-3xl font-bold">{totalOrders}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold">Active Staff</h3>
          <p className="text-3xl font-bold">{activeStaff}</p>
        </Card>
      </div>
    </div>
  );
};
