
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, DollarSign, ShoppingBag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SalesData } from "@/types/staff";
import { useState } from "react";
import { exportToCSV } from "@/utils/exportUtils";

interface AnalyticsPanelProps {
  salesData: SalesData[];
}

export const AnalyticsPanel = ({ salesData }: AnalyticsPanelProps) => {
  const [timeframe, setTimeframe] = useState("week");
  
  const metrics = {
    totalRevenue: salesData.reduce((acc, curr) => acc + curr.revenue, 0),
    totalProfit: salesData.reduce((acc, curr) => acc + curr.profit, 0),
    averageRevenue: salesData.reduce((acc, curr) => acc + curr.revenue, 0) / salesData.length,
    profitMargin: (salesData.reduce((acc, curr) => acc + curr.profit, 0) / 
                   salesData.reduce((acc, curr) => acc + curr.revenue, 0) * 100).toFixed(2)
  };

  const handleExport = () => {
    exportToCSV(salesData, 'sales-analytics');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Sales Analytics</h2>
          <div className="flex gap-4">
            <Select 
              value={timeframe}
              onValueChange={setTimeframe}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold">${metrics.totalRevenue.toFixed(2)}</h3>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Profit</p>
                <h3 className="text-2xl font-bold">${metrics.totalProfit.toFixed(2)}</h3>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Revenue</p>
                <h3 className="text-2xl font-bold">${metrics.averageRevenue.toFixed(2)}</h3>
              </div>
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profit Margin</p>
                <h3 className="text-2xl font-bold">{metrics.profitMargin}%</h3>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4">
            <h3 className="text-md font-medium mb-4">Revenue Trends</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-md font-medium mb-4">Profit Analysis</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="profit" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};
