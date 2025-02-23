
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, TrendingUp, DollarSign, ShoppingBag } from "lucide-react";
import { exportToCSV } from "@/utils/exportUtils";
import type { DailyReport } from "@/types/staff";

interface DailyReportsPanelProps {
  reports: DailyReport[];
}

export const DailyReportsPanel = ({ reports }: DailyReportsPanelProps) => {
  const handleExport = () => {
    exportToCSV(reports, 'daily-reports');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Daily Reports</h2>
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
              <DollarSign className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">
                  ${(reports.reduce((sum, report) => sum + report.averageOrderValue, 0) / reports.length).toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>

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
                      {item.name}
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
