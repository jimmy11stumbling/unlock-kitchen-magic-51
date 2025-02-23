
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, AlertTriangle } from "lucide-react";
import { exportReport } from "@/utils/exportUtils";
import { useState, useMemo, useCallback } from "react";
import type { DailyReport, MenuItem, SalesData } from "@/types/staff";
import { useToast } from "@/components/ui/use-toast";
import { DateRangeSelector } from "./DateRangeSelector";
import { MetricsCards } from "./reports/MetricsCards";
import { RevenueChart } from "./reports/RevenueChart";
import { TopPerformingItems } from "./reports/TopPerformingItems";
import { ReportsTable } from "./reports/ReportsTable";

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
      averageDailyRevenue: totalRevenue / filteredReports.length
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

        <MetricsCards metrics={metrics} />

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <RevenueChart 
            reports={filteredReports}
            chartType={chartType}
            onChartTypeChange={setChartType}
          />
          <TopPerformingItems items={topPerformingItems} />
        </div>

        <ReportsTable reports={filteredReports} />
      </Card>
    </div>
  );
};
