
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { KitchenOrder } from "@/types/staff";

interface OrderActionsProps {
  order: KitchenOrder;
  onUpdateStatus: (orderId: number, status: KitchenOrder["status"]) => void;
}

export function OrderActions({ order, onUpdateStatus }: OrderActionsProps) {
  const [notes, setNotes] = useState(order.notes || "");

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex-1">
            Add Notes
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kitchen Notes</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add preparation notes..."
            />
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
  );
}
