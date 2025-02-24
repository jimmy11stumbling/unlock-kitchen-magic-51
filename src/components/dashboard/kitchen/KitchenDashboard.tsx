
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Clock, AlertTriangle, ChefHat, Utensils } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { KitchenOrder } from "@/types/staff";

export function KitchenDashboard() {
  const { toast } = useToast();
  const [activeStation, setActiveStation] = useState<string>("all");

  const { data: activeOrders = [], isLoading } = useQuery({
    queryKey: ['kitchen-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kitchen_orders')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Transform the data to match KitchenOrder type
      return (data || []).map(order => ({
        id: order.id,
        orderId: order.order_id,
        items: order.items as KitchenOrder['items'],
        priority: order.priority as "normal" | "high" | "rush",
        notes: order.notes || "",
        coursing: order.coursing,
        estimatedDeliveryTime: order.estimated_delivery_time
      })) as KitchenOrder[];
    }
  });

  const handleUpdateOrderStatus = async (orderId: number, itemStatus: "preparing" | "ready" | "delivered") => {
    try {
      const order = activeOrders.find(o => o.id === orderId);
      if (!order) return;

      const updatedItems = order.items.map(item => ({
        ...item,
        status: itemStatus
      }));

      const { error } = await supabase
        .from('kitchen_orders')
        .update({ 
          items: updatedItems,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Order Updated",
        description: `Order #${orderId} is now ${itemStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const stations = ["all", "grill", "prep", "fry", "salad"];

  const filteredOrders = activeStation === "all" 
    ? activeOrders 
    : activeOrders.filter(order => 
        order.items.some(item => item.cookingStation === activeStation)
      );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Kitchen Dashboard</h2>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-yellow-500">
            <Clock className="w-4 h-4 mr-2" />
            Active Orders: {activeOrders.length}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveStation}>
        <TabsList>
          {stations.map((station) => (
            <TabsTrigger key={station} value={station} className="capitalize">
              {station}
            </TabsTrigger>
          ))}
        </TabsList>

        {stations.map((station) => (
          <TabsContent key={station} value={station}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <p>Loading orders...</p>
              ) : (
                filteredOrders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Order #{order.orderId}</h3>
                        <p className="text-sm text-muted-foreground">
                          Items: {order.items.length}
                        </p>
                      </div>
                      <Badge 
                        variant={order.priority === "rush" ? "destructive" : "default"}
                      >
                        {order.priority}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg bg-secondary/10"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {item.quantity}x
                            </Badge>
                            <span>Item #{item.menuItemId}</span>
                          </div>
                          {item.allergenAlert && (
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 space-y-2">
                      {order.notes && (
                        <p className="text-sm text-muted-foreground">
                          Notes: {order.notes}
                        </p>
                      )}
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateOrderStatus(order.id, "preparing")}
                        >
                          <ChefHat className="w-4 h-4 mr-2" />
                          Start
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleUpdateOrderStatus(order.id, "ready")}
                        >
                          <Utensils className="w-4 h-4 mr-2" />
                          Ready
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
