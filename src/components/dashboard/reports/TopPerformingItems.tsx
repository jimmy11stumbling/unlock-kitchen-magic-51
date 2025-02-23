
import { Card } from "@/components/ui/card";

interface TopPerformingItem {
  name: string;
  count: number;
  revenue: number;
}

interface TopPerformingItemsProps {
  items: TopPerformingItem[];
}

export const TopPerformingItems = ({ items }: TopPerformingItemsProps) => {
  return (
    <Card className="p-4">
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
            <span className="font-medium">${item.revenue.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
