
import { Card } from "@/components/ui/card";
import { DateRangeSelector } from "./DateRangeSelector";
import { useState } from "react";
import type { SalesData } from "@/types/staff";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AnalyticsPanelProps {
  salesData: SalesData[];
}

export const AnalyticsPanel = ({ salesData }: AnalyticsPanelProps) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const filteredData = salesData.filter((data) => {
    const date = new Date(data.date);
    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;
    return true;
  });

  const totalRevenue = filteredData.reduce((sum, data) => sum + data.revenue, 0);
  const averageRevenue = totalRevenue / filteredData.length || 0;
  const totalProfit = filteredData.reduce((sum, data) => sum + data.profit, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
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
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Average Revenue</h3>
          <p className="text-3xl font-bold">${averageRevenue.toFixed(2)}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Total Profit</h3>
          <p className="text-3xl font-bold">${totalProfit.toFixed(2)}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              <Line type="monotone" dataKey="profit" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue vs Costs</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#8884d8" />
              <Bar dataKey="costs" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
