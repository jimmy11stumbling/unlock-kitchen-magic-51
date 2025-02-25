
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { OrderItem } from "./OrderItem";
import type { KitchenOrder } from "@/types";

interface OrderCardProps {
  order: KitchenOrder;
  onUpdateStatus: (orderId: number, itemId: number, newStatus: string) => void;
  getStatusBadgeVariant: (status: string) => string;
}

export const OrderCard = ({ order, onUpdateStatus, getStatusBadgeVariant }: OrderCardProps) => {
  return (
    <Card key={order.id} className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Order #{order.orderId}</h3>
            <Badge variant={order.priority === 'rush' ? 'destructive' : 'default'}>
              {order.priority}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Table {order.table_number} • Server: {order.server_name}
          </p>
          <p className="text-sm text-muted-foreground">
            Sent: {new Date(order.created_at).toLocaleTimeString()}
          </p>
        </div>
        <Badge variant={getStatusBadgeVariant(order.status)}>
          {order.status}
        </Badge>
      </div>
      
      <div className="space-y-2">
        {order.items.map((item) => (
          <OrderItem
            key={item.menuItemId}
            item={item}
            orderId={order.id}
            onUpdateStatus={onUpdateStatus}
          />
        ))}
      </div>

      {order.notes && (
        <div className="mt-2">
          <Badge variant="outline" className="w-full justify-start gap-2">
            <AlertTriangle className="h-4 w-4" />
            {order.notes}
          </Badge>
        </div>
      )}

      <div className="text-sm text-muted-foreground mt-2">
        Est. Delivery: {new Date(order.estimated_delivery_time).toLocaleTimeString()}
      </div>
    </Card>
  );
};
