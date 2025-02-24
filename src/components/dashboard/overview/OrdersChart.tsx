
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartTooltip } from "./ChartTooltip";
import type { SalesData } from "@/types/staff";

interface OrdersChartProps {
  data: SalesData[];
}

export const OrdersChart = ({ data }: OrdersChartProps) => {
  // Using order_count instead of orders
  const totalOrders = data.reduce((sum, item) => sum + (item.order_count || 0), 0);
  const avgOrdersPerDay = totalOrders / data.length;

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold">Orders by Time</h3>
        <div className="text-sm text-muted-foreground space-x-4">
          <span>Total Orders: {totalOrders}</span>
          <span>Avg per Day: {avgOrdersPerDay.toFixed(1)}</span>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip content={<ChartTooltip valuePrefix="" />} />
            <Legend />
            <Bar 
              dataKey="order_count" 
              name="Orders"
              fill="#82ca9d" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
