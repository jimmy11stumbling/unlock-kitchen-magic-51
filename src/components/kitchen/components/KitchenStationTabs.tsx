
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { KitchenOrder } from "@/types/staff";
import { KitchenOrderCard } from "../KitchenOrderCard";

interface KitchenStationTabsProps {
  activeStation: string;
  setActiveStation: (station: string) => void;
  orders: KitchenOrder[];
  onStatusUpdate: (orderId: number, status: "preparing" | "ready" | "delivered") => void;
  onFlag: (orderId: number) => void;
}

export function KitchenStationTabs({
  activeStation,
  setActiveStation,
  orders,
  onStatusUpdate,
  onFlag
}: KitchenStationTabsProps) {
  const filteredOrders = orders.filter(order => 
    activeStation === "all" || order.items.some(item => item.cookingStation === activeStation)
  );

  return (
    <Tabs value={activeStation} onValueChange={setActiveStation} className="w-full">
      <TabsList>
        <TabsTrigger value="all">All Orders</TabsTrigger>
        <TabsTrigger value="grill">Grill Station</TabsTrigger>
        <TabsTrigger value="fry">Fry Station</TabsTrigger>
        <TabsTrigger value="salad">Salad Station</TabsTrigger>
        <TabsTrigger value="dessert">Dessert Station</TabsTrigger>
        <TabsTrigger value="beverage">Beverage Station</TabsTrigger>
        <TabsTrigger value="hot">Hot Station</TabsTrigger>
        <TabsTrigger value="cold">Cold Station</TabsTrigger>
      </TabsList>

      <TabsContent value={activeStation}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground py-8">
              No orders for this station
            </p>
          ) : (
            filteredOrders.map((order) => (
              <KitchenOrderCard
                key={order.id}
                order={order}
                onStatusUpdate={onStatusUpdate}
                onFlag={onFlag}
              />
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
