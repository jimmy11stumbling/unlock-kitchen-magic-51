
import { Card } from "@/components/ui/card";
import { 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Calendar, 
  TrendingUp, 
  TrendingDown 
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

  // Calculate period over period changes
  const previousPeriodRevenue = salesData
    .slice(0, Math.floor(salesData.length / 2))
    .reduce((sum, data) => sum + data.revenue, 0);
  const currentPeriodRevenue = salesData
    .slice(Math.floor(salesData.length / 2))
    .reduce((sum, data) => sum + data.revenue, 0);
  const revenueChange = ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100;

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    change, 
    subtitle,
    tooltip
  }: { 
    title: string;
    value: string | number;
    icon: React.ElementType;
    change?: number;
    subtitle?: string;
    tooltip: string;
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="p-6 transition-all hover:shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <h3 className="text-2xl font-bold mt-2">{value}</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Icon className="h-4 w-4 text-primary" />
              </div>
            </div>
            {(change !== undefined || subtitle) && (
              <div className="mt-4">
                {change !== undefined && (
                  <p className={`text-xs flex items-center gap-1 ${
                    change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {change >= 0 ? (
                      <TrendingUp className="inline h-3 w-3" />
                    ) : (
                      <TrendingDown className="inline h-3 w-3" />
                    )}
                    {Math.abs(change).toFixed(1)}% from last period
                  </p>
                )}
                {subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                )}
              </div>
            )}
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Revenue"
        value={`$${totalRevenue.toFixed(2)}`}
        icon={DollarSign}
        change={revenueChange}
        tooltip="Total revenue for the selected period"
      />
      <MetricCard
        title="Active Orders"
        value={totalOrders}
        icon={ShoppingBag}
        subtitle={`Average value: $${avgOrderValue.toFixed(2)}`}
        tooltip="Number of orders currently being processed"
      />
      <MetricCard
        title="Active Staff"
        value={activeStaff}
        icon={Users}
        subtitle={`Total staff: ${staff.length}`}
        tooltip="Number of staff members currently on duty"
      />
      <MetricCard
        title="Pending Reservations"
        value={pendingReservations}
        icon={Calendar}
        subtitle={`Total reservations: ${reservations.length}`}
        tooltip="Number of reservations awaiting confirmation"
      />
    </div>
  );
};
