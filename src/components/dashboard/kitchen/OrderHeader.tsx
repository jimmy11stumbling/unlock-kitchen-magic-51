
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";
import { OrderTicketPrinter } from "./OrderTicketPrinter";
import type { KitchenOrder } from "@/types/staff";

interface OrderHeaderProps {
  order: KitchenOrder;
  onUpdatePriority: (orderId: number, priority: KitchenOrder["priority"]) => void;
}

export function OrderHeader({ order, onUpdatePriority }: OrderHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "preparing": return "bg-blue-100 text-blue-800";
      case "ready": return "bg-green-100 text-green-800";
      case "delivered": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold">Order #{order.order_id}</h3>
        <p className="text-sm text-muted-foreground">
          Table {order.table_number} • {order.server_name}
        </p>
      </div>
      <div className="flex gap-2">
        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
        <OrderTicketPrinter order={order} />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onUpdatePriority(order.id, order.priority === "rush" ? "normal" : "rush")}
        >
          <Flag className={`h-4 w-4 ${order.priority === "rush" ? "text-red-500" : ""}`} />
        </Button>
      </div>
    </div>
  );
}
