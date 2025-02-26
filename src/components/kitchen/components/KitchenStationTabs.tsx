import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle } from "lucide-react";
import type { KitchenOrder, KitchenOrderItem } from "@/types/staff";

interface KitchenStationTabsProps {
  orders: KitchenOrder[];
  onUpdateStatus: (orderId: number, status: KitchenOrderItem["status"]) => void;
}

export function KitchenStationTabs({ orders, onUpdateStatus }: KitchenStationTabsProps) {
  const stations = ["grill", "fry", "salad", "dessert", "beverage", "hot", "cold"];

  const getItemsForStation = (items: KitchenOrderItem[], station: string) => {
    return items.filter(item => item.cooking_station === station);
  };

  const timeElapsed = (item: KitchenOrderItem) => {
    if (!item.start_time) return 0;
    return Math.floor(
      (new Date().getTime() - new Date(item.start_time).getTime()) / 1000 / 60
    );
  };

  return (
    <Tabs defaultValue={stations[0]} className="w-full">
      <TabsList className="grid grid-cols-7">
        {stations.map(station => (
          <TabsTrigger key={station} value={station} className="capitalize">
            {station}
          </TabsTrigger>
        ))}
      </TabsList>
      {stations.map(station => (
        <TabsContent key={station} value={station}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orders.map(order => {
              const stationItems = getItemsForStation(order.items, station);
              if (stationItems.length === 0) return null;

              return (
                <Card key={order.id} className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">Order #{order.order_id}</h3>
                      <p className="text-sm text-muted-foreground">
                        Table {order.table_number}
                      </p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {order.status}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {stationItems.map(item => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-2 bg-muted rounded"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {item.start_time && (
                              <span>{timeElapsed(item)}m</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.status === "preparing" && timeElapsed(item) > 15 && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUpdateStatus(order.id, "ready")}
                            disabled={item.status === "ready" || item.status === "delivered"}
                          >
                            Mark Ready
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
