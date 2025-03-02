import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle } from "lucide-react";
import type { KitchenOrder, KitchenOrderItem } from "@/types/staff";

interface KitchenDisplayProps {
  orders: KitchenOrder[];
  onUpdateStatus: (orderId: number, status: KitchenOrderItem["status"]) => void;
}

export const KitchenDisplay = ({ orders, onUpdateStatus }: KitchenDisplayProps) => {
  const getItemsForStation = (items: KitchenOrderItem[], station: string) => {
    return items.filter(item => item.cooking_station === station);
  };

  const timeElapsed = (item: KitchenOrderItem) => {
    if (!item.start_time) return 0;
    return Math.floor(
      (new Date().getTime() - new Date(item.start_time).getTime()) / 1000 / 60
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <Card key={order.id} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold">Order #{order.order_id}</h3>
              <div className="text-sm text-muted-foreground mt-1">
                Table {order.tableNumber}
              </div>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800">
              {order.status}
            </Badge>
          </div>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-2 bg-muted rounded"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {item.start_time && (
                      <span>{timeElapsed(item)}m</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs"
                  >
                    {item.cooking_station}
                  </Badge>
                  {item.status === "preparing" && timeElapsed(item) > 15 && (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};
