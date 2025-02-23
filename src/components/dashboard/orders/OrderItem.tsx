
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { OrderItem as OrderItemType } from "@/types/staff";

interface OrderItemProps {
  orderItem: OrderItemType;  // Changed from 'item' to 'orderItem'
  kitchenStatus?: "pending" | "preparing" | "ready" | "delivered";
  onKitchenStatusChange: (status: "pending" | "preparing" | "ready" | "delivered") => void;
  isHistoryView?: boolean;
}

export const OrderItem = ({
  orderItem,
  kitchenStatus,
  onKitchenStatusChange,
  isHistoryView = false
}: OrderItemProps) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-medium">{orderItem.name}</h4>
          <p className="text-sm text-muted-foreground">
            Quantity: {orderItem.quantity}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="font-medium">
            ${(orderItem.price * orderItem.quantity).toFixed(2)}
          </p>
          {!isHistoryView && kitchenStatus && (
            <div className="space-x-2">
              {kitchenStatus !== "ready" && kitchenStatus !== "delivered" && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => onKitchenStatusChange(
                    kitchenStatus === "pending" ? "preparing" : "ready"
                  )}
                >
                  {kitchenStatus === "pending" ? "Start" : "Ready"}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
