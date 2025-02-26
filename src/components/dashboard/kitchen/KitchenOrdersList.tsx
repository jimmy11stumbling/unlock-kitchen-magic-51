
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import type { KitchenOrder } from "@/types/staff";

interface KitchenOrdersListProps {
  orders: KitchenOrder[];
  onUpdateStatus: (orderId: number, status: "pending" | "preparing" | "ready" | "delivered") => void;
}

export const KitchenOrdersList = ({ orders, onUpdateStatus }: KitchenOrdersListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString();
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <Card key={order.id} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold">Order #{order.order_id}</h3>
              <p className="text-sm text-muted-foreground">
                Table {order.table_number} • {order.server_name}
              </p>
            </div>
            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
          </div>

          <div className="space-y-4">
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Items</h4>
              {order.items.map((item, index) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="text-muted-foreground">{item.notes}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Ordered at {formatTime(order.created_at)}</span>
            </div>

            <div className="flex gap-2">
              {order.status === "pending" && (
                <Button 
                  className="flex-1"
                  onClick={() => onUpdateStatus(order.id, "preparing")}
                >
                  Start Preparing
                </Button>
              )}
              {order.status === "preparing" && (
                <Button 
                  className="flex-1"
                  onClick={() => onUpdateStatus(order.id, "ready")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Order
                </Button>
              )}
              {["pending", "preparing"].includes(order.status) && (
                <Button 
                  variant="outline"
                  onClick={() => onUpdateStatus(order.id, "delivered")}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
