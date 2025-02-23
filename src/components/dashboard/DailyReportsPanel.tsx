
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, DollarSign, ShoppingCart, Users } from "lucide-react";
import type { DailyReport, MenuItem } from "@/types/staff";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DailyReportsPanelProps {
  reports: DailyReport[];
}

export const DailyReportsPanel = ({ reports }: DailyReportsPanelProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Daily Performance Overview</h2>
          <Select defaultValue="today">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Revenue</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              ${reports[0]?.totalRevenue.toFixed(2) || '0.00'}
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Orders</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              {reports[0]?.totalOrders || 0}
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Average Order Value</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              ${reports[0]?.averageOrderValue.toFixed(2) || '0.00'}
            </p>
          </Card>
        </div>

        <div className="h-[300px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={reports}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Top Selling Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity Sold</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports[0]?.topSellingItems.map((item: MenuItem) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>20</TableCell>
                  <TableCell>${(item.price * 20).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
