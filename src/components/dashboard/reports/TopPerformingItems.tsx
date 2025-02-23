
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { MenuItem } from "@/types/staff";

interface TopPerformingItem {
  name: string;
  count: number;
  revenue: number;
  trend: number; // Percentage change from previous period
}

interface TopPerformingItemsProps {
  items: TopPerformingItem[];
  className?: string;
}

export const TopPerformingItems = ({ items, className }: TopPerformingItemsProps) => {
  return (
    <Card className={`p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Top Performing Items</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-muted-foreground">#{index + 1}</span>
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.count} orders</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">${item.revenue.toFixed(2)}</div>
              <div className={`text-sm flex items-center gap-1 ${
                item.trend >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {item.trend >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(item.trend).toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
