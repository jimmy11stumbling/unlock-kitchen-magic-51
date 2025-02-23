
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DailyReport } from "@/types/staff";

interface RevenueChartProps {
  reports: DailyReport[];
  chartType: 'line' | 'bar';
  onChartTypeChange: (value: 'line' | 'bar') => void;
}

export const RevenueChart = ({ reports, chartType, onChartTypeChange }: RevenueChartProps) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Revenue Trend</h3>
        <Select
          value={chartType}
          onValueChange={onChartTypeChange}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="line">Line</SelectItem>
            <SelectItem value="bar">Bar</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={reports}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" name="Revenue" />
              <Line type="monotone" dataKey="netProfit" stroke="#82ca9d" name="Profit" />
            </LineChart>
          ) : (
            <BarChart data={reports}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalRevenue" fill="#8884d8" name="Revenue" />
              <Bar dataKey="netProfit" fill="#82ca9d" name="Profit" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
