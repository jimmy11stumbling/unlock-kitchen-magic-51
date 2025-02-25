
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle } from "lucide-react";
import type { KitchenOrderItem } from "@/types";

interface OrderItemProps {
  item: KitchenOrderItem;
  orderId: number;
  onUpdateStatus: (orderId: number, itemId: number, newStatus: string) => void;
}

export const OrderItem = ({ item, orderId, onUpdateStatus }: OrderItemProps) => {
  return (
    <div className="flex items-center justify-between bg-muted p-2 rounded">
      <div>
        <span className="font-medium">
          {item.quantity}x {item.itemName}
        </span>
        <div className="flex gap-2 mt-1">
          {item.cookingStation && (
            <Badge variant="outline" className="text-xs">
              {item.cookingStation}
            </Badge>
          )}
          {item.allergenAlert && (
            <Badge variant="destructive" className="text-xs">
              Allergy Alert
            </Badge>
          )}
        </div>
        {item.modifications.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {item.modifications.join(', ')}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={item.status === 'preparing' ? 'default' : 'outline'}
          onClick={() => onUpdateStatus(orderId, item.menuItemId, 'preparing')}
        >
          <Clock className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={item.status === 'ready' ? 'default' : 'outline'}
          onClick={() => onUpdateStatus(orderId, item.menuItemId, 'ready')}
        >
          <CheckCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
