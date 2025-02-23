
import { Card } from "@/components/ui/card";
import { DollarSign, Users, ShoppingCart } from "lucide-react";
import type { StaffMember, Order, SalesData } from "@/types/staff";

interface DashboardOverviewProps {
  salesData: SalesData[];
  staff: StaffMember[];
  orders: Order[];
}

export const DashboardOverview = ({ salesData, staff, orders }: DashboardOverviewProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Total Revenue</h3>
        </div>
        <div className="text-2xl font-bold">
          ${salesData.reduce((acc, curr) => acc + curr.revenue, 0).toFixed(2)}
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Active Staff</h3>
        </div>
        <div className="text-2xl font-bold">
          {staff.filter(s => s.status === "active").length}
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Pending Orders</h3>
        </div>
        <div className="text-2xl font-bold">
          {orders.filter(o => o.status === "pending").length}
        </div>
      </Card>
    </div>
  );
};
