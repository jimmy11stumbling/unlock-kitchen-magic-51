import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { KitchenOrderCard } from "./KitchenOrderCard";
import type { KitchenOrder, KitchenOrderItem } from "@/types/staff";
import { VolumeX, Volume2 } from "lucide-react";

export function KitchenDashboard() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [activeStation, setActiveStation] = useState<string>("all");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
    
    const channel = supabase
      .channel('kitchen-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kitchen_orders' },
        (payload) => {
          console.log('Change received!', payload);
          if (soundEnabled) {
            playNotificationSound();
          }
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [soundEnabled]);

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.play().catch(console.error);
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('kitchen_orders')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;

      const transformedOrders: KitchenOrder[] = data?.map(order => ({
        id: order.id,
        orderId: order.order_id,
        tableNumber: order.table_number,
        items: (Array.isArray(order.items) ? order.items : []).map((item: any) => ({
          menuItemId: Number(item.menuItemId),
          quantity: Number(item.quantity),
          status: validateStatus(item.status),
          cookingStation: validateCookingStation(item.cookingStation),
          assignedChef: item.assignedChef || '',
          modifications: Array.isArray(item.modifications) ? item.modifications : [],
          allergenAlert: Boolean(item.allergenAlert)
        })),
        status: validateStatus(order.status),
        priority: validatePriority(order.priority),
        notes: order.notes,
        estimatedDeliveryTime: order.estimated_delivery_time
      })) || [];

      setOrders(transformedOrders);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    }
  };

  const validateStatus = (status: string): KitchenOrderItem['status'] => {
    const validStatuses = ['pending', 'preparing', 'ready', 'delivered'];
    return validStatuses.includes(status) ? status as KitchenOrderItem['status'] : 'pending';
  };

  const validatePriority = (priority: string): KitchenOrder['priority'] => {
    const validPriorities = ['normal', 'high', 'rush'];
    return validPriorities.includes(priority) ? priority as KitchenOrder['priority'] : 'normal';
  };

  const validateCookingStation = (station: string): KitchenOrderItem['cookingStation'] => {
    const validStations = ['grill', 'fry', 'salad', 'dessert', 'beverage', 'hot', 'cold'];
    return validStations.includes(station) ? station as KitchenOrderItem['cookingStation'] : 'grill';
  };

  const handleStatusUpdate = async (orderId: number, status: "preparing" | "ready" | "delivered") => {
    try {
      const { error } = await supabase
        .from('kitchen_orders')
        .update({ 
          status,
          ...(status === 'preparing' ? { preparation_start_time: new Date().toISOString() } : {}),
          ...(status === 'ready' ? { preparation_end_time: new Date().toISOString() } : {})
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Order #${orderId} marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleFlag = async (orderId: number) => {
    try {
      const order = orders.find(o => o.orderId === orderId);
      const newPriority = order?.priority === "high" ? "normal" : "high";

      const { error } = await supabase
        .from('kitchen_orders')
        .update({ priority: newPriority })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Priority Updated",
        description: `Order #${orderId} priority set to ${newPriority}`,
      });
    } catch (error) {
      console.error('Error updating order priority:', error);
      toast({
        title: "Error",
        description: "Failed to update order priority",
        variant: "destructive",
      });
    }
  };

  const filteredOrders = orders.filter(order => 
    activeStation === "all" || order.items.some(item => item.cookingStation === activeStation)
  );

  if (isLoading) {
    return <div>Loading kitchen orders...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kitchen Display System</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Tabs value={activeStation} onValueChange={setActiveStation} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="grill">Grill Station</TabsTrigger>
          <TabsTrigger value="fry">Fry Station</TabsTrigger>
          <TabsTrigger value="salad">Salad Station</TabsTrigger>
          <TabsTrigger value="dessert">Dessert Station</TabsTrigger>
          <TabsTrigger value="beverage">Beverage Station</TabsTrigger>
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
                  onStatusUpdate={handleStatusUpdate}
                  onFlag={handleFlag}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
