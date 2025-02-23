
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, DollarSign, ShoppingCart, Users, ArrowUpDown, Download } from "lucide-react";
import type { DailyReport, MenuItem } from "@/types/staff";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { useSortableData } from "@/hooks/useSortableData";
import { exportToCSV } from "@/utils/exportUtils";
import { useState } from "react";

interface DailyReportsPanelProps {
  reports: DailyReport[];
}

export const DailyReportsPanel = ({ reports }: DailyReportsPanelProps) => {
  const [timeframe, setTimeframe] = useState("today");
  const { items: sortedReports, requestSort, sortConfig } = useSortableData(reports);

  const handleExport = () => {
    const exportData = reports.map(report => ({
      Date: report.date,
      Revenue: report.totalRevenue,
      Orders: report.totalOrders,
      "Average Order": report.averageOrderValue,
      "Labor Costs": report.laborCosts,
      "Inventory Costs": report.inventoryCosts,
      "Net Profit": report.netProfit
    }));
    exportToCSV(exportData, 'daily-reports');
  };

  const revenueMetrics = {
    totalRevenue: reports.reduce((acc, curr) => acc + curr.totalRevenue, 0),
    totalOrders: reports.reduce((acc, curr) => acc + curr.totalOrders, 0),
    averageOrder: reports.reduce((acc, curr) => acc + curr.averageOrderValue, 0) / reports.length,
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Daily Performance Overview</h2>
          <div className="flex gap-4">
            <Select 
              defaultValue={timeframe} 
              onValueChange={(value) => setTimeframe(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Revenue</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              ${revenueMetrics.totalRevenue.toFixed(2)}
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Total Orders</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              {revenueMetrics.totalOrders}
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Average Order Value</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              ${revenueMetrics.averageOrder.toFixed(2)}
            </p>
          </Card>
        </div>

        <div className="h-[300px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sortedReports}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" name="Revenue" />
              <Line type="monotone" dataKey="netProfit" stroke="#82ca9d" name="Net Profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => requestSort('date')} className="cursor-pointer">
                Date {sortConfig?.key === 'date' && <ArrowUpDown className="inline h-4 w-4" />}
              </TableHead>
              <TableHead onClick={() => requestSort('totalRevenue')} className="cursor-pointer">
                Revenue {sortConfig?.key === 'totalRevenue' && <ArrowUpDown className="inline h-4 w-4" />}
              </TableHead>
              <TableHead onClick={() => requestSort('totalOrders')} className="cursor-pointer">
                Orders {sortConfig?.key === 'totalOrders' && <ArrowUpDown className="inline h-4 w-4" />}
              </TableHead>
              <TableHead onClick={() => requestSort('netProfit')} className="cursor-pointer">
                Net Profit {sortConfig?.key === 'netProfit' && <ArrowUpDown className="inline h-4 w-4" />}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedReports.map((report) => (
              <TableRow key={report.date}>
                <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                <TableCell>${report.totalRevenue.toFixed(2)}</TableCell>
                <TableCell>{report.totalOrders}</TableCell>
                <TableCell>${report.netProfit.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
