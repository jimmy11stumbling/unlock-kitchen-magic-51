
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DailyReport } from "@/types/staff";

interface ReportsTableProps {
  reports: DailyReport[];
}

export const ReportsTable = ({ reports }: ReportsTableProps) => {
  return (
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
          {reports.map((report) => {
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
  );
};
