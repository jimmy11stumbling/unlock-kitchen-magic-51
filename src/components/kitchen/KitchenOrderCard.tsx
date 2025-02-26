
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Flag, CheckCircle, ChefHat, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { KitchenOrder } from "@/types/staff";

interface KitchenOrderCardProps {
  order: KitchenOrder;
  onStatusUpdate: (orderId: number, status: KitchenOrder["status"]) => void;
  onFlag: (orderId: number) => void;
}

export function KitchenOrderCard({ order, onStatusUpdate, onFlag }: KitchenOrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [chefNotes, setChefNotes] = useState(order.notes || "");

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
    <Card className={`p-4 ${order.priority === "rush" ? "border-red-500 border-2" : ""}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Order #{order.order_id}</h3>
            <Badge variant="outline">Table {order.table_number}</Badge>
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFlag(order.order_id)}
        >
          <Flag className={`h-4 w-4 ${order.priority === "high" ? "text-orange-500" : ""}`} />
        </Button>
      </div>

      <div className={`space-y-2 ${isExpanded ? "" : "max-h-24 overflow-hidden"}`}>
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-1 border-b">
            <div>
              <span className="font-medium">x{item.quantity}</span>
              <span className="ml-2">{item.name}</span>
              {item.modifications && item.modifications.length > 0 && (
                <div className="text-sm text-muted-foreground ml-6">
                  {item.modifications.join(", ")}
                </div>
              )}
              {item.allergen_alert && (
                <Badge variant="destructive" className="ml-2">
                  Allergy Alert
                </Badge>
              )}
              {item.assigned_chef && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground ml-2">
                  <ChefHat className="h-3 w-3" />
                  {item.assigned_chef}
                </div>
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
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Notes
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kitchen Notes - Order #{order.order_id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="notes">Chef Notes</Label>
                <Textarea
                  id="notes"
                  value={chefNotes}
                  onChange={(e) => setChefNotes(e.target.value)}
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
            onClick={() => onStatusUpdate(order.order_id, "preparing")}
          >
            Start Preparing
          </Button>
        )}
        {order.status === "preparing" && (
          <Button 
            className="flex-1"
            onClick={() => onStatusUpdate(order.order_id, "ready")}
          >
            Mark as Ready
          </Button>
        )}
        {order.status === "ready" && (
          <Button 
            className="flex-1"
            onClick={() => onStatusUpdate(order.order_id, "delivered")}
          >
            Mark as Delivered
          </Button>
        )}
      </div>
    </Card>
  );
}
