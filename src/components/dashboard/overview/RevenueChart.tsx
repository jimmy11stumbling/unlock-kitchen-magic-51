
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartTooltip } from "./ChartTooltip";
import type { SalesData } from "@/types/staff";

interface RevenueChartProps {
  data: SalesData[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  const formattedData = data.map(item => ({
    ...item,
    profit: item.revenue - item.costs,
  }));

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Revenue Trend</h3>
        <div className="text-sm text-muted-foreground">
          Total Revenue: ${data.reduce((sum, item) => sum + item.revenue, 0).toFixed(2)}
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A1F2C" opacity={0.1} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
              stroke="#9b87f5"
              tick={{ fill: '#9b87f5' }}
            />
            <YAxis 
              stroke="#9b87f5"
              tick={{ fill: '#9b87f5' }}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ color: '#9b87f5' }} />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              name="Revenue"
              stroke="#D946EF" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8, fill: "#D946EF" }}
            />
            <Line 
              type="monotone" 
              dataKey="profit" 
              name="Profit"
              stroke="#0EA5E9" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8, fill: "#0EA5E9" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
