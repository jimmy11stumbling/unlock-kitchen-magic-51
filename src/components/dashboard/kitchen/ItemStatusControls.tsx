
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { KitchenOrderItem } from "@/types/staff";

interface ItemStatusControlsProps {
  item: KitchenOrderItem;
  orderId: number;
  onUpdateItemStatus: (
    orderId: number,
    itemId: number,
    status: KitchenOrderItem["status"],
    assignedChef?: string
  ) => void;
}

export function ItemStatusControls({ item, orderId, onUpdateItemStatus }: ItemStatusControlsProps) {
  const [chefName, setChefName] = useState("");

  return (
    <div className="mt-2 flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex-1">
            <ChefHat className="h-4 w-4 mr-2" />
            {item.assigned_chef ? "Reassign" : "Assign Chef"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Chef</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="chef-name">Chef Name</Label>
              <Input
                id="chef-name"
                value={chefName}
                onChange={(e) => setChefName(e.target.value)}
                placeholder="Enter chef name"
              />
            </div>
            <Button 
              onClick={() => {
                onUpdateItemStatus(orderId, item.id, item.status, chefName);
                setChefName("");
              }}
            >
              Assign Chef
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {item.status === "pending" && (
        <Button 
          size="sm"
          className="flex-1"
          onClick={() => onUpdateItemStatus(orderId, item.id, "preparing")}
        >
          Start Preparing
        </Button>
      )}
      {item.status === "preparing" && (
        <Button 
          size="sm"
          className="flex-1"
          onClick={() => onUpdateItemStatus(orderId, item.id, "ready")}
        >
          Mark Ready
        </Button>
      )}
    </div>
  );
}
