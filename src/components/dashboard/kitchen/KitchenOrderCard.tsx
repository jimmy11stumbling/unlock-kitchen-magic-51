
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock } from "lucide-react";
import type { KitchenOrder } from "@/types/staff";
import { CoursePlannerDialog } from "./CoursePlannerDialog";
import { OrderModificationLog } from "./OrderModificationLog";
import { TemperatureMonitor } from "./TemperatureMonitor";
import { InventoryTracker } from "./InventoryTracker";
import { OrderTimer } from "./OrderTimer";
import { OrderHeader } from "./OrderHeader";
import { OrderItemCard } from "./OrderItemCard";
import { OrderActions } from "./OrderActions";

interface KitchenOrderCardProps {
  order: KitchenOrder;
  onUpdateStatus: (orderId: number, status: KitchenOrder["status"]) => void;
  onUpdatePriority: (orderId: number, priority: KitchenOrder["priority"]) => void;
  onUpdateItemStatus: (
    orderId: number,
    itemId: number,
    status: KitchenOrderItem["status"],
    assignedChef?: string
  ) => void;
}

export function KitchenOrderCard({
  order,
  onUpdateStatus,
  onUpdatePriority,
  onUpdateItemStatus,
}: KitchenOrderCardProps) {
  const [showModifications, setShowModifications] = useState(false);

  return (
    <Card className={`p-4 ${order.priority === "rush" ? "border-red-500" : ""}`}>
      <OrderHeader 
        order={order} 
        onUpdatePriority={onUpdatePriority} 
      />

      {order.status === 'preparing' && (
        <OrderTimer 
          startTime={order.created_at} 
          estimatedDeliveryTime={order.estimated_delivery_time}
          status={order.status}
          orderId={order.order_id}
        />
      )}

      <div className="space-y-4">
        <div className="flex gap-2">
          <CoursePlannerDialog 
            order={order}
            onUpdateCoursing={(orderId, itemId, course) => {
              console.log('Updating course:', { orderId, itemId, course });
            }}
          />
          <Button variant="outline" onClick={() => setShowModifications(true)}>
            View History
          </Button>
        </div>

        {order.items.map((item) => (
          <OrderItemCard
            key={item.id}
            item={item}
            orderId={order.id}
            onUpdateItemStatus={onUpdateItemStatus}
          />
        ))}

        <InventoryTracker order={order} />

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Ordered at {new Date(order.created_at).toLocaleTimeString()}</span>
        </div>

        {order.items.some(item => item.status === "preparing") && (
          <TemperatureMonitor stationId={order.items[0].cooking_station || "main"} />
        )}

        <OrderActions 
          order={order} 
          onUpdateStatus={onUpdateStatus} 
        />
      </div>

      <Dialog open={showModifications} onOpenChange={setShowModifications}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order #{order.order_id} History</DialogTitle>
          </DialogHeader>
          <OrderModificationLog
            modifications={[
              {
                id: 1,
                timestamp: new Date().toISOString(),
                type: 'status',
                user: 'John Chef',
                details: 'Changed status to preparing'
              },
            ]}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
