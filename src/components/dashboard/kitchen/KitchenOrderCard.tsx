
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { KitchenOrder } from "@/types/staff";

interface KitchenOrderCardProps {
  order: KitchenOrder;
  onUpdateStatus: (orderId: number, status: KitchenOrder["status"]) => void;
}

export function KitchenOrderCard({ order, onUpdateStatus }: KitchenOrderCardProps) {
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString();
  };

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

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold">Order #{order.order_id}</h3>
          <p className="text-sm text-muted-foreground">
            Table {order.table_number}
          </p>
        </div>
        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
      </div>

      <div className="space-y-4">
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Items</h4>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.name}</span>
              <span className="text-muted-foreground">{item.notes}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Expected by: {formatTime(order.estimated_delivery_time)}</span>
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
              Mark Ready
            </Button>
          )}
          {order.status === "ready" && (
            <Button 
              className="flex-1"
              onClick={() => onUpdateStatus(order.id, "delivered")}
            >
              Deliver
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
