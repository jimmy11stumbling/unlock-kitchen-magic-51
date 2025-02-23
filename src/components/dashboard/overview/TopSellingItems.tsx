
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import type { MenuItem } from "@/types/staff";

interface TopSellingItemsProps {
  menuItems: MenuItem[];
}

export const TopSellingItems = ({ menuItems }: TopSellingItemsProps) => {
  const topSellingItems = [...menuItems]
    .sort((a, b) => ((b.orderCount ?? 0) - (a.orderCount ?? 0)))
    .slice(0, 5);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Top Selling Items</h3>
      <div className="space-y-4">
        {topSellingItems.map((item, index) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{index + 1}.</span>
              <span>{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">{item.orderCount ?? 0} orders</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
