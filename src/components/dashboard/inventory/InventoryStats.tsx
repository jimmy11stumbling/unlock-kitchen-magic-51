
import { Card } from "@/components/ui/card";
import { Package, AlertTriangle } from "lucide-react";
import type { InventoryItem } from "@/hooks/dashboard/useInventoryData";

interface InventoryStatsProps {
  inventoryItems: InventoryItem[];
  lowStockCount: number;
}

export function InventoryStats({ inventoryItems, lowStockCount }: InventoryStatsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <Card className="p-4 bg-yellow-50">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold">Low Stock Alert</h3>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {lowStockCount} items below minimum quantity
        </p>
      </Card>
      <Card className="p-4 bg-blue-50">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">Total Items</h3>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {inventoryItems.length} items in inventory
        </p>
      </Card>
    </div>
  );
}
