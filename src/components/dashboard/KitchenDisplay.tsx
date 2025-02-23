
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Clock, Check, ChefHat } from "lucide-react";
import type { KitchenOrder, MenuItem } from "@/types/staff";

interface KitchenDisplayProps {
  kitchenOrders: KitchenOrder[];
  menuItems: MenuItem[];
  onUpdateOrderStatus: (orderId: number, itemId: number, status: KitchenOrder["items"][0]["status"]) => void;
}

export const KitchenDisplay = ({
  kitchenOrders,
  menuItems,
  onUpdateOrderStatus,
}: KitchenDisplayProps) => {
  const { toast } = useToast();

  const getItemDetails = (menuItemId: number) => {
    return menuItems.find((item) => item.id === menuItemId);
  };

  const calculateTimeElapsed = (startTime: string | undefined) => {
    if (!startTime) return 0;
    return Math.floor((new Date().getTime() - new Date(startTime).getTime()) / 60000);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Kitchen Orders</h2>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-yellow-600">
              <Clock className="w-4 h-4 mr-1" />
              Active Orders: {kitchenOrders.filter(order => order.items.some(item => item.status === "preparing")).length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kitchenOrders.map((order) => (
            <Card key={order.id} className={`p-4 ${
              order.priority === "rush" ? "border-red-500" :
              order.priority === "high" ? "border-yellow-500" : ""
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium">Order #{order.orderId}</h3>
                  <p className="text-sm text-muted-foreground">
                    Priority: <span className="capitalize">{order.priority}</span>
                  </p>
                </div>
                <ChefHat className={`w-6 h-6 ${
                  order.priority === "rush" ? "text-red-500" :
                  order.priority === "high" ? "text-yellow-500" : "text-blue-500"
                }`} />
              </div>

              <div className="space-y-3">
                {order.items.map((item) => {
                  const menuItem = getItemDetails(item.menuItemId);
                  const timeElapsed = calculateTimeElapsed(item.startTime);
                  const isOverdue = timeElapsed > (menuItem?.preparationTime || 0);

                  return (
                    <div
                      key={item.menuItemId}
                      className={`p-3 rounded-lg border ${
                        item.status === "preparing" && isOverdue ? "border-red-200 bg-red-50" :
                        item.status === "preparing" ? "border-yellow-200 bg-yellow-50" :
                        item.status === "ready" ? "border-green-200 bg-green-50" :
                        "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{menuItem?.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        {item.status === "preparing" && (
                          <span className="text-sm font-medium">
                            {timeElapsed} / {menuItem?.preparationTime} min
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex justify-end space-x-2">
                        {item.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              onUpdateOrderStatus(order.id, item.menuItemId, "preparing");
                              toast({
                                title: "Started preparing",
                                description: `${menuItem?.name} is now being prepared`,
                              });
                            }}
                          >
                            Start Preparing
                          </Button>
                        )}
                        {item.status === "preparing" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              onUpdateOrderStatus(order.id, item.menuItemId, "ready");
                              toast({
                                title: "Item ready",
                                description: `${menuItem?.name} is ready for serving`,
                              });
                            }}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Mark Ready
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {order.notes && (
                <div className="mt-3 text-sm bg-muted p-2 rounded">
                  <p className="font-medium">Notes:</p>
                  <p>{order.notes}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};
