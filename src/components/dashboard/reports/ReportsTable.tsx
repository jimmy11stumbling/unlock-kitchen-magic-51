
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DailyReport } from "@/types/staff";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ReportsTableProps {
  reports: DailyReport[];
}

type SortField = 'date' | 'totalOrders' | 'totalRevenue' | 'laborCosts' | 'inventoryCosts' | 'netProfit' | 'profitMargin';
type SortDirection = 'asc' | 'desc';

export const ReportsTable = ({ reports }: ReportsTableProps) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterValue, setFilterValue] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedAndFilteredReports = reports
    .filter(report => {
      const matchesSearch = report.date.toLowerCase().includes(filterValue.toLowerCase());
      const amount = report.totalRevenue;
      const meetsMinAmount = !minAmount || amount >= parseFloat(minAmount);
      const meetsMaxAmount = !maxAmount || amount <= parseFloat(maxAmount);
      return matchesSearch && meetsMinAmount && meetsMaxAmount;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'totalOrders':
          comparison = a.totalOrders - b.totalOrders;
          break;
        case 'totalRevenue':
          comparison = a.totalRevenue - b.totalRevenue;
          break;
        case 'laborCosts':
          comparison = a.laborCosts - b.laborCosts;
          break;
        case 'inventoryCosts':
          comparison = a.inventoryCosts - b.inventoryCosts;
          break;
        case 'netProfit':
          comparison = a.netProfit - b.netProfit;
          break;
        case 'profitMargin':
          const marginA = (a.netProfit / a.totalRevenue) * 100;
          const marginB = (b.netProfit / b.totalRevenue) * 100;
          comparison = marginA - marginB;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? 
      <TrendingUp className="inline w-4 h-4 ml-1" /> : 
      <TrendingDown className="inline w-4 h-4 ml-1" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium mb-1 block">Search by Date</label>
          <Input
            placeholder="Search by date..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Min Revenue</label>
          <Input
            type="number"
            placeholder="Min amount..."
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="w-32"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Max Revenue</label>
          <Input
            type="number"
            placeholder="Max amount..."
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            className="w-32"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                Date <SortIcon field="date" />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('totalOrders')}>
                Total Orders <SortIcon field="totalOrders" />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('totalRevenue')}>
                Revenue <SortIcon field="totalRevenue" />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('laborCosts')}>
                Labor Cost <SortIcon field="laborCosts" />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('inventoryCosts')}>
                Inventory Cost <SortIcon field="inventoryCosts" />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('netProfit')}>
                Net Profit <SortIcon field="netProfit" />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('profitMargin')}>
                Profit Margin <SortIcon field="profitMargin" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredReports.map((report) => {
              const profitMargin = (report.netProfit / report.totalRevenue) * 100;
              return (
                <TableRow key={report.date} className="hover:bg-muted/50">
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
    </div>
  );
};
