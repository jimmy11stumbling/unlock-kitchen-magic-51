
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle } from "lucide-react";
import type { KitchenOrder } from "@/types/staff";

interface KitchenOrderCardProps {
  order: KitchenOrder;
  onUpdateStatus: (orderId: number, status: KitchenOrder['status']) => Promise<void>;
  onUpdateItemStatus: (orderId: number, itemId: number, status: KitchenOrder['items'][0]['status']) => Promise<void>;
}

export const KitchenOrderCard = ({
  order,
  onUpdateStatus,
  onUpdateItemStatus
}: KitchenOrderCardProps) => {
  const isPastEstimatedTime = new Date(order.estimatedDeliveryTime) < new Date();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">Order #{order.orderId}</h3>
          <p className="text-sm text-muted-foreground">Table {order.tableNumber}</p>
        </div>
        <Badge variant="outline" className={getStatusColor(order.status)}>
          {order.status}
        </Badge>
      </div>

      <div className="space-y-2">
        {order.items.map(item => (
          <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(item.status)}>
                {item.status}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateItemStatus(order.id, item.id, 'ready')}
                disabled={item.status === 'ready' || item.status === 'delivered'}
              >
                Mark Ready
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          <span>
            Est. {new Date(order.estimatedDeliveryTime).toLocaleTimeString()}
          </span>
          {isPastEstimatedTime && (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          )}
        </div>
        <Button
          onClick={() => onUpdateStatus(order.id, 'ready')}
          disabled={order.status === 'ready' || order.status === 'delivered'}
        >
          Mark All Ready
        </Button>
      </div>
    </Card>
  );
};
