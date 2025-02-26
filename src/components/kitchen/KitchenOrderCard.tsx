
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, Flag, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { KitchenOrder } from "@/types/staff";

interface KitchenOrderCardProps {
  order: KitchenOrder;
  onStatusUpdate: (orderId: number, status: "preparing" | "ready" | "delivered") => void;
  onFlag: (orderId: number) => void;
}

export function KitchenOrderCard({ order, onStatusUpdate, onFlag }: KitchenOrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "preparing": return "bg-blue-100 text-blue-800";
      case "ready": return "bg-green-100 text-green-800";
      case "delivered": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const timeElapsed = order.items.some(item => item.startTime) 
    ? formatDistanceToNow(new Date(order.items[0].startTime!))
    : "Not started";

  return (
    <Card className={`p-4 ${order.priority === "rush" ? "border-red-500 border-2" : ""}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Order #{order.orderId}</h3>
            <Badge variant="outline">Table {order.tableNumber}</Badge>
            <Badge className={getStatusColor(order.items[0].status)}>
              {order.items[0].status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Clock className="h-4 w-4" />
            {timeElapsed}
          </div>
        </div>
        <div className="flex gap-2">
          {order.priority === "rush" && (
            <AlertTriangle className="h-5 w-5 text-red-500" />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFlag(order.orderId)}
          >
            <Flag className={`h-4 w-4 ${order.priority === "high" ? "text-orange-500" : ""}`} />
          </Button>
        </div>
      </div>

      <div className={`space-y-2 ${isExpanded ? "" : "max-h-24 overflow-hidden"}`}>
        {order.items.map((item) => (
          <div key={item.menuItemId} className="flex items-center justify-between py-1 border-b">
            <div>
              <span className="font-medium">x{item.quantity}</span>
              <span className="ml-2">{item.menuItemId}</span>
              {item.modifications.length > 0 && (
                <div className="text-sm text-muted-foreground ml-6">
                  {item.modifications.join(", ")}
                </div>
              )}
              {item.allergenAlert && (
                <Badge variant="destructive" className="ml-2">
                  Allergy Alert
                </Badge>
              )}
            </div>
            {item.status === "ready" && <CheckCircle className="h-4 w-4 text-green-500" />}
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="w-full mt-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Show Less" : "Show More"}
      </Button>

      <div className="flex gap-2 mt-4">
        {order.items[0].status === "pending" && (
          <Button 
            className="flex-1"
            onClick={() => onStatusUpdate(order.orderId, "preparing")}
          >
            Start Preparing
          </Button>
        )}
        {order.items[0].status === "preparing" && (
          <Button 
            className="flex-1"
            onClick={() => onStatusUpdate(order.orderId, "ready")}
          >
            Mark as Ready
          </Button>
        )}
        {order.items[0].status === "ready" && (
          <Button 
            className="flex-1"
            onClick={() => onStatusUpdate(order.orderId, "delivered")}
          >
            Mark as Delivered
          </Button>
        )}
      </div>

      {order.notes && (
        <div className="mt-4 p-2 bg-muted rounded-md text-sm">
          <p className="font-medium">Notes:</p>
          <p>{order.notes}</p>
        </div>
      )}
    </Card>
  );
}
