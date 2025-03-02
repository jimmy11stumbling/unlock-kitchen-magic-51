
import { Button } from "@/components/ui/button";
import type { KitchenOrder } from "@/types/staff";

interface OrderActionsProps {
  order: KitchenOrder;
  onUpdateStatus: (orderId: number, status: KitchenOrder["status"]) => void;
}

export function OrderActions({ order, onUpdateStatus }: OrderActionsProps) {
  const allItemsReady = order.items.every(item => item.status === "ready" || item.status === "delivered");
  const allItemsDelivered = order.items.every(item => item.status === "delivered");
  
  return (
    <div className="flex justify-end gap-2 pt-4 border-t">
      {order.status === "pending" && (
        <Button 
          onClick={() => onUpdateStatus(order.id, "preparing")}
          variant="outline"
        >
          Start Preparation
        </Button>
      )}
      
      {order.status === "preparing" && allItemsReady && (
        <Button 
          onClick={() => onUpdateStatus(order.id, "ready")}
          variant="outline"
        >
          Mark Order Ready
        </Button>
      )}
      
      {order.status === "ready" && (
        <Button 
          onClick={() => onUpdateStatus(order.id, "delivered")}
          variant="outline"
        >
          Mark As Delivered
        </Button>
      )}
      
      {order.status !== "pending" && (
        <Button
          variant="secondary"
          onClick={() => {
            // Print ticket functionality would go here
            window.print();
          }}
        >
          Print Ticket
        </Button>
      )}
    </div>
  );
}
