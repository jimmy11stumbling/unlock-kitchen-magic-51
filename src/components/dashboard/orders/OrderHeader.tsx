
import { ShoppingBag } from "lucide-react";
import type { Order } from "@/types/staff";

interface OrderHeaderProps {
  orderData: Order;  // Changed from 'order' to 'orderData' to avoid confusion
}

export const OrderHeader = ({ orderData }: OrderHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-2">
        <ShoppingBag className="h-5 w-5 text-muted-foreground" />
        <div>
          <h3 className="font-medium">Order #{orderData.id}</h3>
          <p className="text-sm text-muted-foreground">
            Table {orderData.tableNumber} • Server: {orderData.serverName}
          </p>
        </div>
      </div>
      <p className="text-sm font-medium">
        ${orderData.total.toFixed(2)}
      </p>
    </div>
  );
};
