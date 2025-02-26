
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ChefHat, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface KitchenOrder {
  id: number;
  table_number: number;
  status: string;
  estimated_delivery_time: string;
  items: any[];
}

export function KitchenStatus() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [averageWaitTime, setAverageWaitTime] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchKitchenOrders();
    subscribeToKitchenOrders();
  }, []);

  const subscribeToKitchenOrders = () => {
    const channel = supabase
      .channel('kitchen-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kitchen_orders'
        },
        () => {
          fetchKitchenOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchKitchenOrders = async () => {
    const { data, error } = await supabase
      .from('kitchen_orders')
      .select('*')
      .in('status', ['pending', 'preparing'])
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch kitchen orders",
        variant: "destructive",
      });
      return;
    }

    setOrders(data || []);
    calculateAverageWaitTime(data || []);
  };

  const calculateAverageWaitTime = (orders: KitchenOrder[]) => {
    if (orders.length === 0) return;

    const waitTimes = orders.map(order => {
      const created = new Date(order.estimated_delivery_time);
      const now = new Date();
      return Math.max(0, (created.getTime() - now.getTime()) / 1000 / 60);
    });

    const average = waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length;
    setAverageWaitTime(Math.round(average));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ChefHat className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Kitchen Status</h3>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Avg. Wait: {averageWaitTime} min</span>
        </div>
      </div>
      <div className="space-y-3">
        {orders.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No active orders</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Table {order.table_number}</span>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {order.items.length} items
                </div>
              </div>
              <div className="flex items-center gap-2">
                {new Date(order.estimated_delivery_time) < new Date() && (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                )}
                <span className="text-sm">
                  Est: {new Date(order.estimated_delivery_time).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
