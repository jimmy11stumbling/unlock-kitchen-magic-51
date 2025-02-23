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
  Activity,
  Percent
} from "lucide-react";
import { exportToCSV, exportReport } from "@/utils/exportUtils";
import { useState, useMemo, useCallback } from "react";
import type { DailyReport, MenuItem, SalesData } from "@/types/staff";
import { useToast } from "@/components/ui/use-toast";
import { DateRangeSelector } from "./DateRangeSelector";

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
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  
  const handleExport = async () => {
    try {
      await exportReport(reports, 'daily-reports', exportFormat);
      toast({
        title: "Export Successful",
        description: `Your report has been exported as ${exportFormat.toUpperCase()} successfully.`,
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

  const handleDateRangeChange = useCallback((start: Date | undefined, end: Date | undefined) => {
    if (start && end && start > end) {
      toast({
        title: "Invalid date range",
        description: "Start date cannot be after end date",
        variant: "destructive",
      });
      return;
    }
    setStartDate(start);
    setEndDate(end);
  }, [toast]);

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const reportDate = new Date(report.date);
      if (startDate && reportDate < startDate) return false;
      if (endDate && reportDate > endDate) return false;
      return true;
    });
  }, [reports, startDate, endDate]);

  const metrics = useMemo(() => {
    if (!filteredReports.length) return null;

    const totalRevenue = filteredReports.reduce((sum, report) => sum + report.totalRevenue, 0);
    const totalOrders = filteredReports.reduce((sum, report) => sum + report.totalOrders, 0);
    const totalLaborCosts = filteredReports.reduce((sum, report) => sum + report.laborCosts, 0);
    const totalInventoryCosts = filteredReports.reduce((sum, report) => sum + report.inventoryCosts, 0);
    const totalProfit = filteredReports.reduce((sum, report) => sum + report.netProfit, 0);

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue: totalRevenue / totalOrders,
      totalProfit,
      profitMargin: (totalProfit / totalRevenue) * 100,
      laborCostRatio: (totalLaborCosts / totalRevenue) * 100,
      inventoryCostRatio: (totalInventoryCosts / totalRevenue) * 100,
      averageDailyRevenue: totalRevenue / filteredReports.length,
      averageDailyOrders: totalOrders / filteredReports.length
    };
  }, [filteredReports]);

  const topPerformingItems = useMemo(() => {
    const itemMap = new Map<string, { count: number; revenue: number }>();
    
    filteredReports.forEach(report => {
      report.topSellingItems.forEach(item => {
        const existing = itemMap.get(item.name) || { count: 0, revenue: 0 };
        itemMap.set(item.name, {
          count: existing.count + (item.orderCount || 0),
          revenue: existing.revenue + ((item.orderCount || 0) * item.price)
        });
      });
    });

    return Array.from(itemMap.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredReports]);

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
            <h2 className="text-2xl font-bold">Daily Reports</h2>
            <p className="text-muted-foreground">Comprehensive performance analysis</p>
          </div>
          <div className="flex gap-4">
            <DateRangeSelector
              startDate={startDate}
              endDate={endDate}
              onRangeChange={handleDateRangeChange}
            />
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
            <Select
              value={exportFormat}
              onValueChange={(value: 'csv' | 'pdf') => setExportFormat(value)}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export {exportFormat.toUpperCase()}
            </Button>
          </div>
        </div>

        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${metrics.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Net Profit</p>
                  <p className="text-2xl font-bold">${metrics.totalProfit.toFixed(2)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Percent className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Profit Margin</p>
                  <p className="text-2xl font-bold">{metrics.profitMargin.toFixed(1)}%</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg Daily Revenue</p>
                  <p className="text-2xl font-bold">${metrics.averageDailyRevenue.toFixed(2)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-8 h-8 text-indigo-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{metrics.totalOrders}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-8 h-8 text-pink-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                  <p className="text-2xl font-bold">${metrics.averageOrderValue.toFixed(2)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Labor Cost Ratio</p>
                  <p className="text-2xl font-bold">{metrics.laborCostRatio.toFixed(1)}%</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Inventory Cost</p>
                  <p className="text-2xl font-bold">{metrics.inventoryCostRatio.toFixed(1)}%</p>
                </div>
              </div>
            </Card>
          </div>
        )}

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
                  <LineChart data={filteredReports}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" name="Revenue" />
                    <Line type="monotone" dataKey="netProfit" stroke="#82ca9d" name="Profit" />
                  </LineChart>
                ) : (
                  <BarChart data={filteredReports}>
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

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Top Performing Items</h3>
            <div className="space-y-4">
              {topPerformingItems.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-muted-foreground">#{index + 1}</span>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.count} orders</p>
                    </div>
                  </div>
                  <span className="font-medium">${item.revenue.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Labor Cost</TableHead>
                <TableHead>Inventory Cost</TableHead>
                <TableHead>Net Profit</TableHead>
                <TableHead>Profit Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => {
                const profitMargin = (report.netProfit / report.totalRevenue) * 100;
                return (
                  <TableRow key={report.date}>
                    <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                    <TableCell>{report.totalOrders}</TableCell>
                    <TableCell>${report.totalRevenue.toFixed(2)}</TableCell>
                    <TableCell>${report.laborCosts.toFixed(2)}</TableCell>
                    <TableCell>${report.inventoryCosts.toFixed(2)}</TableCell>
                    <TableCell>${report.netProfit.toFixed(2)}</TableCell>
                    <TableCell>{profitMargin.toFixed(1)}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
