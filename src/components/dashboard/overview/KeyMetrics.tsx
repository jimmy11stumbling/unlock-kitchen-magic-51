
import { Card } from "@/components/ui/card";
import { DollarSign, Users, ShoppingBag, Calendar, TrendingUp } from "lucide-react";
import type { SalesData, StaffMember, Order, Reservation } from "@/types/staff";

interface KeyMetricsProps {
  salesData: SalesData[];
  staff: StaffMember[];
  orders: Order[];
  reservations: Reservation[];
}

export const KeyMetrics = ({ salesData, staff, orders, reservations }: KeyMetricsProps) => {
  const totalRevenue = salesData.reduce((sum, data) => sum + data.revenue, 0);
  const totalOrders = orders.length;
  const activeStaff = staff.filter(member => member.status === 'active').length;
  const pendingReservations = reservations.filter(r => r.status === 'pending').length;
  const avgOrderValue = totalRevenue / totalOrders || 0;

  return (
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
  );
};
