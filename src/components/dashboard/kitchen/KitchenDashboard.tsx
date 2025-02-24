import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useIngredientManagement } from '@/hooks/dashboard/useIngredientManagement';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { KitchenOrder, KitchenOrderItem } from "@/types/kitchen";

export function KitchenDashboard() {
  const [alerts, setAlerts] = useState<string[]>([]);
  const [activeOrders, setActiveOrders] = useState<KitchenOrder[]>([]);
  const { ingredients, checkLowStock } = useIngredientManagement();
  const { toast } = useToast();

  useEffect(() => {
    const lowStockItems = checkLowStock();
    if (lowStockItems.length > 0) {
      setAlerts(lowStockItems.map(item => 
        `Low stock alert: ${item.name} (${item.current_stock} ${item.unit} remaining)`
      ));
    }
  }, [ingredients]);

  useEffect(() => {
    const fetchKitchenOrders = async () => {
      const { data: ordersData, error } = await supabase
        .from('kitchen_orders')
        .select(`
          id,
          order_id,
          items,
          priority,
          notes,
          coursing,
          created_at,
          updated_at,
          estimated_delivery_time,
          table_number,
          server_name,
          status
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching kitchen orders:', error);
        return;
      }

      if (ordersData) {
        const transformedOrders: KitchenOrder[] = ordersData.map(order => {
          const items = (typeof order.items === 'string' ? JSON.parse(order.items) : order.items) as KitchenOrderItem[];
          
          return {
            id: order.id,
            orderId: order.order_id,
            items: items.map(item => ({
              menuItemId: item.menuItemId,
              itemName: item.itemName || `Item #${item.menuItemId}`, // Fallback for missing names
              quantity: item.quantity,
              status: item.status || 'pending',
              startTime: item.startTime,
              completionTime: item.completionTime,
              cookingStation: item.cookingStation,
              assignedChef: item.assignedChef,
              modifications: item.modifications || [],
              allergenAlert: item.allergenAlert || false
            })),
            priority: (order.priority as KitchenOrder['priority']) || 'normal',
            notes: order.notes || '',
            coursing: (order.coursing as KitchenOrder['coursing']) || 'standard',
            created_at: order.created_at,
            updated_at: order.updated_at,
            estimated_delivery_time: order.estimated_delivery_time,
            table_number: order.table_number,
            server_name: order.server_name,
            status: (order.status as KitchenOrder['status']) || 'pending'
          };
        });

        setActiveOrders(transformedOrders);
      }
    };

    fetchKitchenOrders();

    const channel = supabase
      .channel('kitchen-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kitchen_orders' },
        (payload) => {
          console.log('Kitchen order update:', payload);
          fetchKitchenOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateOrderStatus = async (orderId: number, itemId: number, newStatus: string) => {
    try {
      const order = activeOrders.find(o => o.id === orderId);
      if (!order) return;

      const updatedItems = order.items.map(item => 
        item.menuItemId === itemId ? { ...item, status: newStatus } : item
      );

      const allItemsReady = updatedItems.every(item => item.status === 'ready');

      const { error } = await supabase
        .from('kitchen_orders')
        .update({ 
          items: updatedItems,
          status: allItemsReady ? 'ready' : 'preparing'
        })
        .eq('id', orderId);

      if (error) throw error;

      if (allItemsReady) {
        toast({
          title: "Order Ready",
          description: `Order #${orderId} is ready for service`,
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ready': return 'success';
      case 'preparing': return 'default';
      case 'pending': return 'secondary';
      case 'delivered': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Kitchen Alerts Section */}
        <Card className="col-span-full p-6">
          <h2 className="text-xl font-semibold mb-4">Kitchen Alerts</h2>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <Alert variant="destructive" key={index}>
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Stock Alert</AlertTitle>
                <AlertDescription>{alert}</AlertDescription>
              </Alert>
            ))}
          </div>
        </Card>

        {/* Active Orders Section */}
        <Card className="col-span-full p-6">
          <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeOrders.map((order) => (
              <Card key={order.id} className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Order #{order.orderId}</h3>
                      <Badge variant={order.priority === 'rush' ? 'destructive' : 'default'}>
                        {order.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Table {order.table_number} • Server: {order.server_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Sent: {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.menuItemId} className="flex items-center justify-between bg-muted p-2 rounded">
                      <div>
                        <span className="font-medium">
                          {item.quantity}x {item.itemName}
                        </span>
                        <div className="flex gap-2 mt-1">
                          {item.cookingStation && (
                            <Badge variant="outline" className="text-xs">
                              {item.cookingStation}
                            </Badge>
                          )}
                          {item.allergenAlert && (
                            <Badge variant="destructive" className="text-xs">
                              Allergy Alert
                            </Badge>
                          )}
                        </div>
                        {item.modifications.length > 0 && (
                          <p className="text-sm text-muted-foreground">
                            {item.modifications.join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={item.status === 'preparing' ? 'default' : 'outline'}
                          onClick={() => updateOrderStatus(order.id, item.menuItemId, 'preparing')}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={item.status === 'ready' ? 'default' : 'outline'}
                          onClick={() => updateOrderStatus(order.id, item.menuItemId, 'ready')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {order.notes && (
                  <div className="mt-2">
                    <Badge variant="outline" className="w-full justify-start gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {order.notes}
                    </Badge>
                  </div>
                )}

                <div className="text-sm text-muted-foreground mt-2">
                  Est. Delivery: {new Date(order.estimated_delivery_time).toLocaleTimeString()}
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Ingredient Status Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Ingredient Status</h2>
          <div className="space-y-4">
            {ingredients.map((ingredient) => (
              <div key={ingredient.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{ingredient.name}</span>
                  <Badge variant={ingredient.current_stock <= ingredient.minimum_stock ? "destructive" : "default"}>
                    {ingredient.current_stock} {ingredient.unit}
                  </Badge>
                </div>
                <Progress 
                  value={(ingredient.current_stock / (ingredient.minimum_stock * 2)) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
