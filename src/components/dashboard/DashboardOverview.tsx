import { Card } from "@/components/ui/card";
import { SearchBar } from "./SearchBar";
import { DateRangeSelector } from "./DateRangeSelector";
import { useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import { 
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Star,
  Calendar 
} from "lucide-react";
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

  const totalRevenue = filteredSalesData.reduce((sum, data) => sum + data.revenue, 0);
  const totalOrders = orders.length;
  const activeStaff = filteredStaff.filter(member => member.status === 'active').length;
  const pendingReservations = reservations.filter(r => r.status === 'pending').length;
  const lowStockItems = inventory.filter(item => item.quantity <= item.minQuantity).length;
  
  // Calculate top selling items with null check
  const topSellingItems = [...menuItems]
    .sort((a, b) => ((b.orderCount ?? 0) - (a.orderCount ?? 0)))
    .slice(0, 5);

  // Calculate average order value
  const avgOrderValue = totalRevenue / totalOrders || 0;

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

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <h3 className="text-2xl font-bold">${totalRevenue.toFixed(2)}</h3>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12.5% from last period
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
              <h3 className="text-2xl font-bold">{totalOrders}</h3>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <ShoppingBag className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">Average value: ${avgOrderValue.toFixed(2)}</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Staff</p>
              <h3 className="text-2xl font-bold">{activeStaff}</h3>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">Total staff: {staff.length}</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Reservations</p>
              <h3 className="text-2xl font-bold">{pendingReservations}</h3>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">Total reservations: {reservations.length}</p>
          </div>
        </Card>
      </div>

      {/* Charts and Additional Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Orders by Time</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Alerts and Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Alerts</h3>
          <div className="space-y-4">
            {lowStockItems > 0 && (
              <div className="flex items-center gap-2 text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                <p>{lowStockItems} items low in stock</p>
              </div>
            )}
            {pendingReservations > 0 && (
              <div className="flex items-center gap-2 text-blue-600">
                <Clock className="h-4 w-4" />
                <p>{pendingReservations} reservations need confirmation</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Selling Items</h3>
          <div className="space-y-4">
            {topSellingItems.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{index + 1}.</span>
                  <span>{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">{item.orderCount ?? 0} orders</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
