import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { KitchenOrder, KitchenOrderItem } from "@/types/staff";

interface KitchenStationTabsProps {
  orders: KitchenOrder[];
  onUpdateStatus: (orderId: number, status: KitchenOrder["status"]) => void;
  onUpdateItemStatus: (
    orderId: number,
    itemId: number,
    status: KitchenOrderItem["status"],
    assignedChef?: string
  ) => void;
}

export function KitchenStationTabs({ orders, onUpdateStatus, onUpdateItemStatus }: KitchenStationTabsProps) {
  const [activeTab, setActiveTab] = useState("all");

  // Calculate item status counts for each order
  const [itemStatusCounts, setItemStatusCounts] = useState<{
    [orderId: number]: { total: number; completed: number };
  }>({});

  useEffect(() => {
    const counts: { [orderId: number]: { total: number; completed: number } } = {};
    orders.forEach((order) => {
      const totalItems = order.items.length;
      const completedItems = order.items.filter((item) => item.status === "ready").length;
      counts[order.id] = { total: totalItems, completed: completedItems };
    });
    setItemStatusCounts(counts);
  }, [orders]);

  // Filter orders based on the active tab
  const filteredOrders = activeTab === "all"
    ? orders
    : orders.filter((order) => order.items.some((item) => item.cooking_station === activeTab));

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList>
        <TabsTrigger value="all">All Stations</TabsTrigger>
        <TabsTrigger value="grill">Grill</TabsTrigger>
        <TabsTrigger value="fry">Fry Station</TabsTrigger>
        <TabsTrigger value="salad">Salad Station</TabsTrigger>
        <TabsTrigger value="dessert">Dessert Station</TabsTrigger>
        <TabsTrigger value="beverage">Beverage Station</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold">Order #{order.order_id}</h3>
                <p className="text-sm text-muted-foreground">
                  Table {order.tableNumber}, {itemStatusCounts[order.id]?.completed}/{itemStatusCounts[order.id]?.total} items ready
                </p>
              </div>
              
              {/* Add action buttons or status indicators here */}
            </div>
          </div>
        ))}
      </TabsContent>
      
      <TabsContent value="grill">
        {/* Content for Grill Station */}
      </TabsContent>
      
      <TabsContent value="fry">
        {/* Content for Fry Station */}
      </TabsContent>
      
      <TabsContent value="salad">
        {/* Content for Salad Station */}
      </TabsContent>
      
      <TabsContent value="dessert">
        {/* Content for Dessert Station */}
      </TabsContent>
      
      <TabsContent value="beverage">
        {/* Content for Beverage Station */}
      </TabsContent>
    </Tabs>
  );
}
