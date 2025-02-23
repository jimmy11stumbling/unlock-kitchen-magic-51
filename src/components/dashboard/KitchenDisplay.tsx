
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { KitchenOrder, MenuItem } from "@/types/staff";
import { Timer, AlertCircle } from "lucide-react";

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
  const getMenuItem = (id: number) => menuItems.find(item => item.id === id);

  const getStatusColor = (status: KitchenOrder["items"][0]["status"]) => {
    switch (status) {
      case "pending": return "bg-gray-100";
      case "preparing": return "bg-blue-100";
      case "ready": return "bg-green-100";
      case "delivered": return "bg-gray-100";
      default: return "bg-gray-100";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Kitchen Display System</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kitchenOrders.map((order) => (
          <Card key={order.id} className={`p-4 ${order.priority === "rush" ? "border-red-500" : ""}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">Order #{order.orderId}</h3>
                <p className="text-sm text-muted-foreground">
                  Priority: {order.priority}
                </p>
              </div>
              {order.priority === "rush" && (
                <AlertCircle className="text-red-500" />
              )}
            </div>

            <div className="space-y-3">
              {order.items.map((item) => {
                const menuItem = getMenuItem(item.menuItemId);
                return (
                  <div
                    key={`${order.id}-${item.menuItemId}`}
                    className={`p-3 rounded-md ${getStatusColor(item.status)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{menuItem?.name}</p>
                        <p className="text-sm">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Timer className="w-4 h-4 mr-1" />
                        {menuItem?.preparationTime}m
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant={item.status === "preparing" ? "default" : "outline"}
                        onClick={() => onUpdateOrderStatus(order.id, item.menuItemId, "preparing")}
                        disabled={item.status === "delivered"}
                      >
                        Preparing
                      </Button>
                      <Button
                        size="sm"
                        variant={item.status === "ready" ? "default" : "outline"}
                        onClick={() => onUpdateOrderStatus(order.id, item.menuItemId, "ready")}
                        disabled={item.status === "delivered" || item.status === "pending"}
                      >
                        Ready
                      </Button>
                      <Button
                        size="sm"
                        variant={item.status === "delivered" ? "default" : "outline"}
                        onClick={() => onUpdateOrderStatus(order.id, item.menuItemId, "delivered")}
                        disabled={item.status !== "ready"}
                      >
                        Delivered
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {order.notes && (
              <div className="mt-4 text-sm bg-yellow-50 p-2 rounded">
                <p className="font-medium">Notes:</p>
                <p>{order.notes}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </Card>
  );
};
