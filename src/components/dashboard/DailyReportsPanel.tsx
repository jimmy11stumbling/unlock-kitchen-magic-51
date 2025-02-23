
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Download, TrendingUp, DollarSign, ShoppingBag, CreditCard, Users, Clock } from "lucide-react";
import { exportToCSV } from "@/utils/exportUtils";
import type { DailyReport, MenuItem } from "@/types/staff";

interface DailyReportsPanelProps {
  reports: DailyReport[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const DailyReportsPanel = ({ reports }: DailyReportsPanelProps) => {
  const latestReport = reports[reports.length - 1];
  
  const salesByCategory = latestReport?.topSellingItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + (item.orderCount ?? 0);
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(salesByCategory || {}).map(([category, value]) => ({
    name: category,
    value
  }));

  const handleExport = () => {
    exportToCSV(reports, 'daily-reports');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Daily Reports</h2>
            <p className="text-muted-foreground">Comprehensive daily performance analysis</p>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ${reports.reduce((sum, report) => sum + report.totalRevenue, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold">
                  ${reports.reduce((sum, report) => sum + report.netProfit, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">
                  {reports.reduce((sum, report) => sum + report.totalOrders, 0)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">
                  ${(reports.reduce((sum, report) => sum + report.averageOrderValue, 0) / reports.length).toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reports}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" />
                  <Line type="monotone" dataKey="netProfit" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Labor Cost</TableHead>
                <TableHead>Inventory Cost</TableHead>
                <TableHead>Net Profit</TableHead>
                <TableHead>Top Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.date}>
                  <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                  <TableCell>{report.totalOrders}</TableCell>
                  <TableCell>${report.totalRevenue.toFixed(2)}</TableCell>
                  <TableCell>${report.laborCosts.toFixed(2)}</TableCell>
                  <TableCell>${report.inventoryCosts.toFixed(2)}</TableCell>
                  <TableCell>${report.netProfit.toFixed(2)}</TableCell>
                  <TableCell>
                    {report.topSellingItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="text-sm">
                        {item.name} ({item.orderCount ?? 0})
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
