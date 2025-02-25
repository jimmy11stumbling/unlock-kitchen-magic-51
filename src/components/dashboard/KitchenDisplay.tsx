import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Clock, Check, ChefHat, Flame, Bell, Timer } from "lucide-react";
import type { KitchenOrder, MenuItem } from "@/types";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [activeView, setActiveView] = useState<"all" | "pending" | "preparing" | "ready">("all");
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getItemDetails = (menuItemId: number) => {
    return menuItems.find((item) => item.id === menuItemId);
  };

  const calculateTimeElapsed = (startTime: string | undefined) => {
    if (!startTime) return 0;
    return Math.floor((new Date().getTime() - new Date(startTime).getTime()) / 60000);
  };

  const playAlertSound = () => {
    const audio = new Audio('/alert.mp3');
    audio.play().catch(console.error);
  };

  const filteredOrders = kitchenOrders.filter(order => {
    if (activeView === "all") return true;
    return order.items.some(item => item.status === activeView);
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    // Rush orders first
    if (a.priority === "rush" && b.priority !== "rush") return -1;
    if (b.priority === "rush" && a.priority !== "rush") return 1;
    
    // Then high priority
    if (a.priority === "high" && b.priority === "normal") return -1;
    if (b.priority === "high" && a.priority === "normal") return 1;
    
    // Finally sort by time
    return new Date(b.items[0]?.startTime || "").getTime() - 
           new Date(a.items[0]?.startTime || "").getTime();
  });

  const handleStatusUpdate = (orderId: number, itemId: number, status: KitchenOrder["items"][0]["status"]) => {
    onUpdateOrderStatus(orderId, itemId, status);
    
    if (status === "ready") {
      playAlertSound();
      toast({
        title: "Order Ready!",
        description: "An order is ready for pickup",
      });
    }
  };

  const getOrderProgress = (order: KitchenOrder) => {
    const total = order.items.length;
    const completed = order.items.filter(item => item.status === "ready").length;
    return (completed / total) * 100;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Kitchen Display</h2>
            <p className="text-muted-foreground">
              Active Orders: {kitchenOrders.filter(order => 
                order.items.some(item => item.status === "preparing")
              ).length}
            </p>
          </div>
          <div className="flex gap-4">
            <Select value={activeView} onValueChange={(value: typeof activeView) => setActiveView(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="preparing">In Progress</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedOrders.map((order) => {
            const progress = getOrderProgress(order);
            return (
              <Card key={order.id} className={`p-4 ${
                order.priority === "rush" ? "border-red-500 bg-red-50" :
                order.priority === "high" ? "border-yellow-500 bg-yellow-50" : ""
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Order #{order.orderId}</h3>
                      {order.priority === "rush" && (
                        <span className="flex items-center gap-1 text-red-600">
                          <Flame className="h-4 w-4" />
                          Rush
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Progress: {Math.round(progress)}%
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

                    if (activeView !== "all" && item.status !== activeView) return null;

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
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity} • Est. Time: {menuItem?.preparationTime}min
                            </p>
                          </div>
                          {item.status === "preparing" && (
                            <div className="flex items-center gap-2">
                              <Timer className="h-4 w-4" />
                              <span className={`text-sm font-medium ${
                                isOverdue ? "text-red-600" : ""
                              }`}>
                                {timeElapsed}min
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-2 flex justify-end space-x-2">
                          {item.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(order.id, item.menuItemId, "preparing")}
                            >
                              Start Preparing
                            </Button>
                          )}
                          {item.status === "preparing" && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(order.id, item.menuItemId, "ready")}
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
            )
          })}
        </div>

        {sortedOrders.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No active orders matching the selected filter
          </div>
        )}
      </Card>
    </div>
  );
};
