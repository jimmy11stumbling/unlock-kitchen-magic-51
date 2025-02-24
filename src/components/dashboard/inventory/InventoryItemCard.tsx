
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { InventoryItem } from "@/hooks/dashboard/useInventoryData";

interface InventoryItemCardProps {
  item: InventoryItem;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
}

export function InventoryItemCard({ item, onUpdateQuantity }: InventoryItemCardProps) {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-sm text-muted-foreground">
            Category: {item.category}
          </p>
        </div>
        {item.quantity <= item.minQuantity && (
          <Badge variant="destructive">Low Stock</Badge>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Quantity:</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            >
              -
            </Button>
            <span className="min-w-[3rem] text-center">
              {item.quantity} {item.unit}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              +
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Min Quantity:</span>
          <span>{item.minQuantity} {item.unit}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Price per {item.unit}:</span>
          <span>${item.price.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
}
