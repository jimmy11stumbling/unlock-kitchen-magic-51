
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, AlertTriangle, Filter, Search } from "lucide-react";
import { exportReport } from "@/utils/exportUtils";
import { useState, useMemo, useCallback } from "react";
import type { DailyReport, MenuItem, SalesData } from "@/types/staff";
import { useToast } from "@/components/ui/use-toast";
import { DateRangeSelector } from "./DateRangeSelector";
import { MetricsCards } from "./reports/MetricsCards";
import { RevenueChart } from "./reports/RevenueChart";
import { TopPerformingItems } from "./reports/TopPerformingItems";
import { ReportsTable } from "./reports/ReportsTable";
import { DetailedRevenue } from "./reports/DetailedRevenue";
import { CategoryPerformance } from "./reports/CategoryPerformance";
import { SalesHeatmap } from "./reports/SalesHeatmap";
import { Input } from "@/components/ui/input";

interface DailyReportsPanelProps {
  reports: DailyReport[];
  salesData: SalesData[];
  onAddSalesData: (data: Omit<SalesData, "profit">) => void;
}

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
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'overview' | 'detailed' | 'categories' | 'hourly'>('overview');
  
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
      
      // Filter by search term in item names
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return report.topSellingItems.some(item => 
          item.name.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [reports, startDate, endDate, searchTerm]);

  const metrics = useMemo(() => {
    if (!filteredReports.length) return null;

    const totalRevenue = filteredReports.reduce((sum, report) => sum + report.totalRevenue, 0);
    const totalOrders = filteredReports.reduce((sum, report) => sum + report.totalOrders, 0);
    const totalLaborCosts = filteredReports.reduce((sum, report) => sum + report.laborCosts, 0);
    const totalInventoryCosts = filteredReports.reduce((sum, report) => sum + report.inventoryCosts, 0);
    const totalProfit = filteredReports.reduce((sum, report) => sum + report.netProfit, 0);

    // Calculate period over period comparisons if we have more than one report
    let revenueGrowth = 0;
    let orderGrowth = 0;
    let profitGrowth = 0;
    
    if (filteredReports.length > 1) {
      const sortedReports = [...filteredReports].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      const firstReport = sortedReports[0];
      const lastReport = sortedReports[sortedReports.length - 1];
      
      revenueGrowth = ((lastReport.totalRevenue - firstReport.totalRevenue) / firstReport.totalRevenue) * 100;
      orderGrowth = ((lastReport.totalOrders - firstReport.totalOrders) / firstReport.totalOrders) * 100;
      profitGrowth = ((lastReport.netProfit - firstReport.netProfit) / firstReport.netProfit) * 100;
    }

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue: totalRevenue / totalOrders,
      totalProfit,
      profitMargin: (totalProfit / totalRevenue) * 100,
      laborCostRatio: (totalLaborCosts / totalRevenue) * 100,
      inventoryCostRatio: (totalInventoryCosts / totalRevenue) * 100,
      averageDailyRevenue: totalRevenue / filteredReports.length,
      revenueGrowth,
      orderGrowth,
      profitGrowth
    };
  }, [filteredReports]);

  const calculateTrends = (items: { name: string; count: number; revenue: number }[]) => {
    const previousPeriodItems = reports[1]?.topSellingItems || [];
    return items.map(item => {
      const previousItem = previousPeriodItems.find(prev => prev.name === item.name);
      const trend = previousItem
        ? ((item.revenue - (previousItem.price * (previousItem.orderCount || 0))) / 
           (previousItem.price * (previousItem.orderCount || 0))) * 100
        : 0;
      return { ...item, trend };
    });
  };

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

    const items = Array.from(itemMap.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return calculateTrends(items);
  }, [filteredReports, reports]);

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
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
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
          
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs value={activeView} onValueChange={(v: string) => setActiveView(v as any)}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="detailed">Detailed</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="hourly">Hourly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <MetricsCards metrics={metrics} />

          {activeView === 'overview' && (
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <RevenueChart 
                reports={filteredReports}
                chartType={chartType}
                onChartTypeChange={setChartType}
              />
              <TopPerformingItems items={topPerformingItems} />
            </div>
          )}
          
          {activeView === 'detailed' && (
            <DetailedRevenue reports={filteredReports} />
          )}
          
          {activeView === 'categories' && (
            <CategoryPerformance reports={filteredReports} />
          )}
          
          {activeView === 'hourly' && (
            <SalesHeatmap reports={filteredReports} />
          )}

          <ReportsTable reports={filteredReports} />
        </div>
      </Card>
    </div>
  );
}
