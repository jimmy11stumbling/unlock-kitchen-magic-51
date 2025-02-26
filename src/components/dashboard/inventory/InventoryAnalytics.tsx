
import { Card } from "@/components/ui/card";
import { 
  Bar, 
  BarChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  AlertTriangle,
  ShoppingCart 
} from "lucide-react";
import type { InventoryItem } from "@/hooks/dashboard/useInventoryData";
import { useMemo } from "react";

interface InventoryAnalyticsProps {
  inventoryItems: InventoryItem[];
}

const COLORS = ['#0ea5e9', '#84cc16', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'];

export function InventoryAnalytics({ inventoryItems }: InventoryAnalyticsProps) {
  const categoryData = useMemo(() => {
    return inventoryItems.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = {
          category,
          totalValue: 0,
          itemCount: 0,
          lowStockCount: 0,
          averagePrice: 0,
          totalQuantity: 0
        };
      }
      acc[category].totalValue += item.price * item.quantity;
      acc[category].itemCount += 1;
      acc[category].totalQuantity += item.quantity;
      if (item.quantity <= item.minQuantity) {
        acc[category].lowStockCount += 1;
      }
      acc[category].averagePrice = acc[category].totalValue / acc[category].totalQuantity;
      return acc;
    }, {} as Record<string, { 
      category: string; 
      totalValue: number; 
      itemCount: number; 
      lowStockCount: number; 
      averagePrice: number;
      totalQuantity: number;
    }>);
  }, [inventoryItems]);

  const chartData = Object.values(categoryData);

  const pieData = chartData.map(({ category, totalValue }) => ({
    name: category,
    value: totalValue
  }));

  const metrics = useMemo(() => ({
    totalValue: inventoryItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    totalItems: inventoryItems.length,
    averageValue: inventoryItems.reduce((sum, item) => sum + item.price * item.quantity, 0) / inventoryItems.length || 0,
    lowStockCount: inventoryItems.filter(item => item.quantity <= item.minQuantity).length,
    outOfStockCount: inventoryItems.filter(item => item.quantity === 0).length,
    highestValueItems: [...inventoryItems]
      .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
      .slice(0, 5),
    averageStockLevel: inventoryItems.reduce((sum, item) => sum + (item.quantity / item.idealStockLevel) * 100, 0) / inventoryItems.length || 0,
  }), [inventoryItems]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Total Inventory Value</h3>
              <p className="text-2xl font-bold">${metrics.totalValue.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Stock Health</h3>
              <p className="text-2xl font-bold">{metrics.averageStockLevel.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Average stock level</p>
            </div>
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Low Stock Alert</h3>
              <p className="text-2xl font-bold">{metrics.lowStockCount}</p>
              <p className="text-sm text-muted-foreground">Items below minimum</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Inventory Turnover</h3>
              <p className="text-2xl font-bold">{metrics.outOfStockCount}</p>
              <p className="text-sm text-muted-foreground">Items out of stock</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Value Distribution by Category</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => entry.name}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Category Performance</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalValue" name="Total Value" fill="#0ea5e9" />
                <Bar dataKey="lowStockCount" name="Low Stock Items" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Category Metrics Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Category</th>
                <th className="text-right p-2">Total Value</th>
                <th className="text-right p-2">Item Count</th>
                <th className="text-right p-2">Avg Price</th>
                <th className="text-right p-2">Low Stock</th>
                <th className="text-right p-2">Total Quantity</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((data) => (
                <tr key={data.category} className="border-b">
                  <td className="p-2">{data.category}</td>
                  <td className="text-right p-2">${data.totalValue.toFixed(2)}</td>
                  <td className="text-right p-2">{data.itemCount}</td>
                  <td className="text-right p-2">${data.averagePrice.toFixed(2)}</td>
                  <td className="text-right p-2">{data.lowStockCount}</td>
                  <td className="text-right p-2">{data.totalQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Highest Value Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Item Name</th>
                <th className="text-right p-2">Total Value</th>
                <th className="text-right p-2">Quantity</th>
                <th className="text-right p-2">Unit Price</th>
                <th className="text-right p-2">Category</th>
              </tr>
            </thead>
            <tbody>
              {metrics.highestValueItems.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">{item.name}</td>
                  <td className="text-right p-2">${(item.price * item.quantity).toFixed(2)}</td>
                  <td className="text-right p-2">{item.quantity}</td>
                  <td className="text-right p-2">${item.price.toFixed(2)}</td>
                  <td className="text-right p-2">{item.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
