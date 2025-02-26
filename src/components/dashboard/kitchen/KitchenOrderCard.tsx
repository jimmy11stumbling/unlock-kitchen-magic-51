
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  ChefHat, 
  AlertTriangle, 
  Flag, 
  MessageSquare, 
  Flame,
  Timer
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { KitchenOrder, KitchenOrderItem } from "@/types/staff";

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
  onUpdateItemStatus 
}: KitchenOrderCardProps) {
  const [notes, setNotes] = useState(order.notes || "");
  const [assignedChef, setAssignedChef] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "preparing": return "bg-blue-100 text-blue-800";
      case "ready": return "bg-green-100 text-green-800";
      case "delivered": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const timeElapsed = (item: KitchenOrderItem) => {
    if (!item.start_time) return 0;
    return Math.floor(
      (new Date().getTime() - new Date(item.start_time).getTime()) / 1000 / 60
    );
  };

  const isOverdue = (item: KitchenOrderItem) => {
    return item.status === "preparing" && timeElapsed(item) > 15;
  };

  return (
    <Card className={`p-4 ${order.priority === "rush" ? "border-red-500 border-2" : ""}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Order #{order.order_id}</h3>
            <Badge variant="outline">Table {order.table_number}</Badge>
            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Server: {order.server_name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {order.priority === "rush" && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Flame className="h-3 w-3" />
              RUSH
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdatePriority(order.id, order.priority === "rush" ? "normal" : "rush")}
          >
            <Flag className={`h-4 w-4 ${order.priority === "rush" ? "text-red-500" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {order.items.map((item) => (
          <div 
            key={item.id} 
            className={`p-3 rounded-lg ${
              item.status === "ready" ? "bg-green-50" : 
              item.status === "preparing" ? "bg-blue-50" : 
              "bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">
                  {item.quantity}x {item.name}
                </div>
                {item.notes && (
                  <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                {item.cooking_station}
              </Badge>
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm">
              {item.status === "preparing" && (
                <>
                  <Timer className="h-4 w-4" />
                  <span>{timeElapsed(item)}m</span>
                  {isOverdue(item) && (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                </>
              )}
              {item.assigned_chef && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ChefHat className="h-4 w-4" />
                  <span>{item.assigned_chef}</span>
                </div>
              )}
            </div>

            <div className="mt-2 flex gap

-2">
              {item.status === "pending" && (
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    const chef = assignedChef || "Anonymous Chef";
                    onUpdateItemStatus(order.id, item.id, "preparing", chef);
                  }}
                >
                  Start Preparing
                </Button>
              )}
              {item.status === "preparing" && (
                <Button 
                  size="sm"
                  className="flex-1"
                  onClick={() => onUpdateItemStatus(order.id, item.id, "ready")}
                >
                  Mark Ready
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Notes
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Notes & Assignment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="chef">Assign Chef</Label>
                <Input
                  id="chef"
                  value={assignedChef}
                  onChange={(e) => setAssignedChef(e.target.value)}
                  placeholder="Enter chef name"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="notes">Kitchen Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add preparation notes..."
                  className="mt-2"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {order.status === "pending" && (
          <Button 
            className="flex-1"
            onClick={() => onUpdateStatus(order.id, "preparing")}
          >
            Start All Items
          </Button>
        )}
        {order.status === "preparing" && (
          <Button 
            className="flex-1"
            onClick={() => onUpdateStatus(order.id, "ready")}
          >
            Complete Order
          </Button>
        )}
        {order.status === "ready" && (
          <Button 
            className="flex-1"
            onClick={() => onUpdateStatus(order.id, "delivered")}
          >
            Mark Delivered
          </Button>
        )}
      </div>
    </Card>
  );
}
