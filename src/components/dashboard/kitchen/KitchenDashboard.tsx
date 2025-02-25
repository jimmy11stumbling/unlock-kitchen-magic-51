
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import type { KitchenOrder, Ingredient } from "@/types";
import { AlertSection } from './AlertSection';
import { OrderCard } from './OrderCard';
import { IngredientStatus } from './IngredientStatus';
import { useIngredientManagement } from '@/hooks/dashboard/useIngredientManagement';

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
        .select('*');

      if (error) {
        console.error('Error fetching kitchen orders:', error);
        return;
      }

      if (ordersData) {
        const transformedOrders: KitchenOrder[] = ordersData.map(order => ({
          id: order.id,
          orderId: order.order_id || 0,
          items: typeof order.items === 'string' 
            ? JSON.parse(order.items)
            : order.items,
          priority: order.priority,
          notes: order.notes || '',
          coursing: order.coursing,
          created_at: order.created_at,
          updated_at: order.updated_at,
          estimated_delivery_time: order.estimated_delivery_time,
          table_number: order.table_number || 0,
          server_name: order.server_name || '',
          status: order.status
        }));

        setActiveOrders(transformedOrders);
      }
    };

    fetchKitchenOrders();

    const channel = supabase
      .channel('kitchen-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kitchen_orders' },
        () => {
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
        <AlertSection alerts={alerts} />

        <Card className="col-span-full p-6">
          <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={updateOrderStatus}
                getStatusBadgeVariant={getStatusBadgeVariant}
              />
            ))}
          </div>
        </Card>

        <IngredientStatus ingredients={ingredients} />
      </div>
    </div>
  );
}
