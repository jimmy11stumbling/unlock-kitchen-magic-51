import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Volume2, AlertTriangle } from "lucide-react";
import type { KitchenOrder, KitchenOrderItem } from "@/types/staff";
import { CoursePlannerDialog } from "./CoursePlannerDialog";
import { OrderModificationLog } from "./OrderModificationLog";
import { TemperatureMonitor } from "./TemperatureMonitor";
import { InventoryTracker } from "./InventoryTracker";
import { OrderProgress } from "./OrderProgress";
import { OrderHeader } from "./OrderHeader";
import { OrderItemCard } from "./OrderItemCard";
import { OrderActions } from "./OrderActions";
import { useToast } from "@/components/ui/use-toast";

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
  const [showAlerts, setShowAlerts] = useState(false);
  const { toast } = useToast();

  // Calculate if order is delayed
  const isDelayed = new Date() > new Date(order.estimated_delivery_time);
  
  // Calculate if order is close to being delayed (within 5 minutes)
  const warningThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds
  const timeRemaining = new Date(order.estimated_delivery_time).getTime() - new Date().getTime();
  const isCloseToDelayed = timeRemaining > 0 && timeRemaining < warningThreshold;

  // Play sound alert for rush orders or delayed orders
  const playAlertSound = () => {
    const audio = new Audio("/notification.mp3");
    audio.play().catch(err => console.error("Error playing sound:", err));
    
    toast({
      title: order.priority === "rush" ? "Rush Order Alert" : "Order Delay Warning",
      description: order.priority === "rush" 
        ? `Rush order #${order.order_id} needs immediate attention!` 
        : `Order #${order.order_id} is close to being delayed!`,
      variant: "destructive",
    });
  };

  return (
    <Card className={`p-4 ${order.priority === "rush" ? "border-red-500 bg-red-50" : isDelayed ? "border-orange-500 bg-orange-50" : ""}`}>
      <OrderHeader 
        order={order} 
        onUpdatePriority={onUpdatePriority} 
      />

      {(order.priority === "rush" || isDelayed || isCloseToDelayed) && (
        <div className={`flex items-center gap-2 p-2 mb-4 rounded text-sm ${order.priority === "rush" ? "bg-red-100 text-red-800" : isDelayed ? "bg-orange-100 text-orange-800" : "bg-yellow-100 text-yellow-800"}`}>
          <AlertTriangle className="h-4 w-4" />
          <span>
            {order.priority === "rush" ? "RUSH ORDER - Immediate attention required" : 
             isDelayed ? "ORDER DELAYED - Expedite preparation" : 
             "WARNING - Order approaching delay threshold"}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto h-6 w-6" 
            onClick={playAlertSound}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {order.status === 'preparing' && (
        <div className="my-4">
          <OrderProgress 
            items={order.items} 
            createdAt={order.created_at} 
            estimatedDeliveryTime={order.estimated_delivery_time}
          />
        </div>
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
          <Button 
            variant="outline" 
            onClick={() => setShowAlerts(!showAlerts)}
            className={isDelayed || order.priority === "rush" ? "bg-red-100" : ""}
          >
            Alerts
          </Button>
        </div>

        {showAlerts && (
          <div className="p-3 border rounded-md bg-slate-50">
            <h4 className="font-medium mb-2">Order Alerts</h4>
            <ul className="space-y-1 text-sm">
              {order.priority === "rush" && (
                <li className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-3 w-3" />
                  Rush order requires immediate attention
                </li>
              )}
              {isDelayed && (
                <li className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="h-3 w-3" />
                  Order is delayed by {Math.floor((new Date().getTime() - new Date(order.estimated_delivery_time).getTime()) / 60000)} minutes
                </li>
              )}
              {isCloseToDelayed && (
                <li className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="h-3 w-3" />
                  Order will be delayed soon (less than 5 minutes remaining)
                </li>
              )}
              {order.items.filter(i => i.status === "pending").length > 0 && (
                <li className="flex items-center gap-2 text-blue-600">
                  <AlertTriangle className="h-3 w-3" />
                  {order.items.filter(i => i.status === "pending").length} items still pending
                </li>
              )}
            </ul>
          </div>
        )}

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
