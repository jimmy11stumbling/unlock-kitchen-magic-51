
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Clock, AlertTriangle, ChefHat, Utensils, RefreshCcw } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { KitchenOrder, MenuItem } from "@/types/staff";

// This interface matches the actual Supabase response structure
interface SupabaseKitchenOrder {
  id: number;
  order_id: number;
  items: {
    menuItemId: number;
    quantity: number;
    status: "pending" | "preparing" | "ready" | "delivered";
    cookingStation: string;
    allergenAlert: boolean;
  }[];
  priority: string;
  notes: string | null;
  coursing: string;
  estimated_delivery_time: string;
  table_number: number | null;
  created_at: string | null;
  updated_at: string | null;
  menu_items: MenuItem[];
}

export function KitchenDashboard() {
  const { toast } = useToast();
  const [activeStation, setActiveStation] = useState<string>("all");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data: activeOrders = [], isLoading, refetch } = useQuery({
    queryKey: ['kitchen-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kitchen_orders')
        .select('*, menu_items(*)')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;

      // First cast to unknown, then to our known type to safely handle the conversion
      const orders = (data as unknown) as SupabaseKitchenOrder[];
      
      return orders.map(order => ({
        id: order.id,
        orderId: order.order_id,
        items: order.items.map(item => ({
          ...item,
          menuItem: order.menu_items.find(mi => mi.id === item.menuItemId)
        })),
        priority: order.priority as "normal" | "high" | "rush",
        notes: order.notes || "",
        coursing: order.coursing,
        estimatedDeliveryTime: order.estimated_delivery_time,
        tableNumber: order.table_number || 0
      }));
    },
    refetchInterval: autoRefresh ? 10000 : false
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number, status: string }) => {
      const { error } = await supabase
        .from('kitchen_orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Order Updated",
        description: "Kitchen order status has been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  });

  const stations = ["all", "grill", "prep", "fry", "salad", "dessert"];

  const filteredOrders = activeStation === "all" 
    ? activeOrders 
    : activeOrders?.filter(order => 
        order.items.some(item => item.cookingStation === activeStation)
      );

  const getPriorityColor = (priority: "normal" | "high" | "rush") => {
    switch (priority) {
      case "rush":
        return "bg-red-500";
      case "high":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  const handleUpdateStatus = (orderId: number, status: "preparing" | "ready" | "delivered") => {
    updateOrderMutation.mutate({ orderId, status });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Kitchen Dashboard</h2>
          <p className="text-muted-foreground">Manage and track kitchen orders</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "bg-primary/10" : ""}
          >
            <RefreshCcw className={`w-4 h-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
            {autoRefresh ? "Auto-refresh On" : "Auto-refresh Off"}
          </Button>
          <Badge variant="outline" className="text-yellow-500">
            <Clock className="w-4 h-4 mr-2" />
            Active Orders: {activeOrders?.length || 0}
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
              ) : filteredOrders?.length === 0 ? (
                <p className="col-span-full text-center text-muted-foreground py-8">
                  No active orders for this station
                </p>
              ) : (
                filteredOrders?.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">Order #{order.orderId}</h3>
                          <Badge variant="outline">Table {order.tableNumber}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Items: {order.items.length}
                        </p>
                      </div>
                      <Badge className={getPriorityColor(order.priority)}>
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
                            <div>
                              <span className="font-medium">
                                {item.menuItem?.name || `Item #${item.menuItemId}`}
                              </span>
                              {item.cookingStation && (
                                <p className="text-sm text-muted-foreground">
                                  Station: {item.cookingStation}
                                </p>
                              )}
                            </div>
                          </div>
                          {item.allergenAlert && (
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 space-y-2">
                      {order.notes && (
                        <p className="text-sm text-muted-foreground bg-secondary/10 p-2 rounded">
                          Notes: {order.notes}
                        </p>
                      )}
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Est. Delivery: {new Date(order.estimatedDeliveryTime).toLocaleTimeString()}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id, "preparing")}
                          >
                            <ChefHat className="w-4 h-4 mr-2" />
                            Start
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id, "ready")}
                          >
                            <Utensils className="w-4 h-4 mr-2" />
                            Ready
                          </Button>
                        </div>
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
