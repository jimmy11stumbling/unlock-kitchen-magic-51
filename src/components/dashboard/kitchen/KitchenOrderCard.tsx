
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, ChefHat, AlertTriangle, Flag, Timer } from "lucide-react";
import type { KitchenOrder, KitchenOrderItem, MenuItem } from "@/types/staff";
import { CoursePlannerDialog } from "./CoursePlannerDialog";
import { RecipeInstructionsDialog } from "./RecipeInstructionsDialog";
import { OrderModificationLog } from "./OrderModificationLog";
import { TemperatureMonitor } from "./TemperatureMonitor";

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
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [chefName, setChefName] = useState("");
  const [notes, setNotes] = useState(order.notes || "");
  const [showModifications, setShowModifications] = useState(false);

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

  const convertToMenuItem = (item: KitchenOrderItem): MenuItem => ({
    id: item.menu_item_id,
    name: item.name,
    category: item.course || "main",
    price: 0,
    description: item.notes || "",
    preparationTime: 15,
    allergens: item.allergens || [],
    available: true,
    prep_details: {
      temperature_requirements: {
        min: 165,
        max: 175,
        unit: "F"
      }
    }
  });

  return (
    <Card className={`p-4 ${order.priority === "rush" ? "border-red-500" : ""}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">Order #{order.order_id}</h3>
          <p className="text-sm text-muted-foreground">
            Table {order.table_number} • {order.server_name}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdatePriority(order.id, order.priority === "rush" ? "normal" : "rush")}
          >
            <Flag className={`h-4 w-4 ${order.priority === "rush" ? "text-red-500" : ""}`} />
          </Button>
        </div>
      </div>

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
        </div>

        {order.items.map((item) => (
          <div 
            key={item.id}
            className={`p-3 rounded-lg border ${
              item.status === "ready" ? "bg-green-50" :
              item.status === "preparing" ? "bg-blue-50" :
              "bg-gray-50"
            }`}
          >
            <div className="flex justify-between">
              <div>
                <div className="font-medium">
                  {item.quantity}x {item.name}
                </div>
                {item.notes && (
                  <p className="text-sm text-muted-foreground">{item.notes}</p>
                )}
              </div>
              <Badge variant="outline">
                {item.cooking_station || "No Station"}
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
                <div className="flex items-center gap-1 text-muted-foreground ml-auto">
                  <ChefHat className="h-4 w-4" />
                  <span>{item.assigned_chef}</span>
                </div>
              )}
            </div>

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
                        onUpdateItemStatus(order.id, item.id, item.status, chefName);
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
                  onClick={() => onUpdateItemStatus(order.id, item.id, "preparing")}
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

            {item.allergens && item.allergens.length > 0 && (
              <div className="mt-2 p-2 bg-red-50 rounded flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700">
                  Allergens: {item.allergens.join(", ")}
                </span>
              </div>
            )}

            <div className="mt-2">
              <RecipeInstructionsDialog item={convertToMenuItem(item)} />
            </div>
          </div>
        ))}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Ordered at {new Date(order.created_at).toLocaleTimeString()}</span>
        </div>

        {order.items.some(item => item.status === "preparing") && (
          <TemperatureMonitor stationId={order.items[0].cooking_station || "main"} />
        )}

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
              // Add more modification entries as needed
            ]}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
