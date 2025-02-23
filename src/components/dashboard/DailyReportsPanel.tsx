
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
import { 
  Download, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  CreditCard, 
  Users, 
  Clock,
  AlertTriangle,
  BarChart3,
  Activity
} from "lucide-react";
import { exportToCSV } from "@/utils/exportUtils";
import { useState, useMemo } from "react";
import type { DailyReport, MenuItem, SalesData } from "@/types/staff";
import { useToast } from "@/components/ui/use-toast";

interface DailyReportsPanelProps {
  reports: DailyReport[];
  salesData: SalesData[];
  onAddSalesData: (data: Omit<SalesData, "profit">) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const DailyReportsPanel = ({ 
  reports, 
  salesData,
  onAddSalesData 
}: DailyReportsPanelProps) => {
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('day');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  
  const latestReport = reports[reports.length - 1];

  const handleExport = async () => {
    try {
      await exportToCSV(reports, 'analytics-reports');
      toast({
        title: "Export Successful",
        description: "Your report has been exported successfully.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was a problem exporting your report.",
        variant: "destructive",
      });
    }
  };

  const aggregatedMetrics = useMemo(() => {
    if (!reports.length) return null;

    return {
      totalRevenue: reports.reduce((sum, report) => sum + report.totalRevenue, 0),
      totalOrders: reports.reduce((sum, report) => sum + report.totalOrders, 0),
      averageOrderValue: reports.reduce((sum, report) => sum + report.averageOrderValue, 0) / reports.length,
      totalProfit: reports.reduce((sum, report) => sum + report.netProfit, 0),
      laborCostRatio: (reports.reduce((sum, report) => sum + report.laborCosts, 0) / 
                       reports.reduce((sum, report) => sum + report.totalRevenue, 0) * 100).toFixed(2),
      inventoryCostRatio: (reports.reduce((sum, report) => sum + report.inventoryCosts, 0) / 
                          reports.reduce((sum, report) => sum + report.totalRevenue, 0) * 100).toFixed(2)
    };
  }, [reports]);

  const salesByCategory = useMemo(() => {
    if (!latestReport?.topSellingItems) return [];
    
    const categoryMap = latestReport.topSellingItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + (item.orderCount ?? 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryMap).map(([category, value]) => ({
      name: category,
      value
    }));
  }, [latestReport]);

  if (!reports.length) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
            <h3 className="text-lg font-semibold">No Reports Available</h3>
            <p className="text-muted-foreground">There are no reports to display for the selected period.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
            <p className="text-muted-foreground">Comprehensive performance analysis</p>
          </div>
          <div className="flex gap-2">
            <Select
              value={timeframe}
              onValueChange={(value: 'day' | 'week' | 'month') => setTimeframe(value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">
                  ${aggregatedMetrics?.totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Profit</p>
                <p className="text-2xl font-bold">
                  ${aggregatedMetrics?.totalProfit.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Orders</p>
                <p className="text-2xl font-bold">
                  {aggregatedMetrics?.totalOrders}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Order</p>
                <p className="text-2xl font-bold">
                  ${aggregatedMetrics?.averageOrderValue.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Labor Cost</p>
                <p className="text-2xl font-bold">{aggregatedMetrics?.laborCostRatio}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-8 h-8 text-indigo-500" />
              <div>
                <p className="text-sm text-muted-foreground">Inventory</p>
                <p className="text-2xl font-bold">{aggregatedMetrics?.inventoryCostRatio}%</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Revenue Trend</h3>
              <Select
                value={chartType}
                onValueChange={(value: 'line' | 'bar') => setChartType(value)}
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
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                    <Line type="monotone" dataKey="profit" stroke="#82ca9d" name="Profit" />
                  </LineChart>
                ) : (
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                    <Bar dataKey="profit" fill="#82ca9d" name="Profit" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {salesByCategory.map((entry, index) => (
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
