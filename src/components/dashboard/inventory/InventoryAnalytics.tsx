
import { Card } from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { InventoryItem } from "@/hooks/dashboard/useInventoryData";

interface InventoryAnalyticsProps {
  inventoryItems: InventoryItem[];
}

export function InventoryAnalytics({ inventoryItems }: InventoryAnalyticsProps) {
  const categoryData = inventoryItems.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = {
        category,
        totalValue: 0,
        itemCount: 0,
        lowStockCount: 0
      };
    }
    acc[category].totalValue += item.price * item.quantity;
    acc[category].itemCount += 1;
    if (item.quantity <= item.minQuantity) {
      acc[category].lowStockCount += 1;
    }
    return acc;
  }, {} as Record<string, { category: string; totalValue: number; itemCount: number; lowStockCount: number; }>);

  const chartData = Object.values(categoryData);

  const totalValue = inventoryItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const averageValue = totalValue / inventoryItems.length || 0;
  const lowStockCount = inventoryItems.filter(item => item.quantity <= item.minQuantity).length;
  const outOfStockCount = inventoryItems.filter(item => item.quantity === 0).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <h3 className="font-semibold text-sm">Total Inventory Value</h3>
          <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-sm">Average Item Value</h3>
          <p className="text-2xl font-bold">${averageValue.toFixed(2)}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-sm">Low Stock Items</h3>
          <p className="text-2xl font-bold">{lowStockCount}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-sm">Out of Stock Items</h3>
          <p className="text-2xl font-bold">{outOfStockCount}</p>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Inventory Value by Category</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalValue" fill="#0ea5e9" name="Total Value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
