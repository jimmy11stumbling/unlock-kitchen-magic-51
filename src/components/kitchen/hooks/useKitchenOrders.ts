import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { KitchenOrder, KitchenOrderItem } from "@/types/staff";

export function useKitchenOrders() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  const transformOrder = (order: any): KitchenOrder => ({
    id: order.id,
    orderId: order.order_id,
    tableNumber: order.table_number,
    items: order.items.map((item: any) => ({
      id: item.id || Math.random(),
      name: item.name || `Item ${item.menuItemId}`,
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
    estimatedDeliveryTime: order.estimated_delivery_time,
    createdAt: order.created_at || new Date().toISOString()
  });

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('kitchen_orders')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;

      const transformedOrders: KitchenOrder[] = data?.map(order => transformOrder(order)) || [];

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

      fetchOrders();
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
      const order = orders.find(o => o.id === orderId);
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

      fetchOrders();
    } catch (error) {
      console.error('Error updating order priority:', error);
      toast({
        title: "Error",
        description: "Failed to update order priority",
        variant: "destructive",
      });
    }
  };

  return {
    orders,
    isLoading,
    fetchOrders,
    handleStatusUpdate,
    handleFlag
  };
}
