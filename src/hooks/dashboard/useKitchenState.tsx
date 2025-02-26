
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { KitchenOrder, KitchenOrderItem } from "@/types/staff";
import type { Json } from "@/hooks/dashboard/types/orderTypes";
import { useToast } from "@/components/ui/use-toast";

export const useKitchenState = () => {
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchKitchenOrders();
    subscribeToKitchenUpdates();
  }, []);

  const parseKitchenItems = (items: Json): KitchenOrderItem[] => {
    if (!Array.isArray(items)) return [];
    return items.map(item => {
      const itemData = item as Record<string, Json>;
      return {
        id: Number(itemData.id || 0),
        name: String(itemData.name || ''),
        quantity: Number(itemData.quantity || 0),
        status: (itemData.status as string || 'pending') as KitchenOrderItem['status'],
        notes: itemData.notes as string | undefined,
        menuItemId: Number(itemData.menuItemId || 0),
        startTime: itemData.startTime as string | undefined,
        cookingStation: itemData.cookingStation as string | undefined,
        assignedChef: itemData.assignedChef as string | undefined,
        modifications: Array.isArray(itemData.modifications) ? itemData.modifications as string[] : undefined,
        allergenAlert: Boolean(itemData.allergenAlert)
      };
    });
  };

  const fetchKitchenOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('kitchen_orders')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const parsedOrders: KitchenOrder[] = data.map(order => ({
        id: order.id,
        orderId: order.order_id,
        tableNumber: order.table_number,
        items: parseKitchenItems(order.items),
        status: order.status as KitchenOrder['status'],
        priority: order.priority as KitchenOrder['priority'],
        estimatedDeliveryTime: order.estimated_delivery_time,
        createdAt: order.created_at
      }));

      setKitchenOrders(parsedOrders);
    } catch (error) {
      console.error('Error fetching kitchen orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch kitchen orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToKitchenUpdates = () => {
    const channel = supabase
      .channel('kitchen-orders')
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
  };

  const updateOrderStatus = async (orderId: number, status: KitchenOrder['status']) => {
    try {
      const { error } = await supabase
        .from('kitchen_orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      setKitchenOrders(orders =>
        orders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );

      toast({
        title: "Order Updated",
        description: `Order #${orderId} status changed to ${status}`,
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

  const updateItemStatus = async (
    orderId: number,
    itemId: number,
    status: KitchenOrderItem['status']
  ) => {
    try {
      const order = kitchenOrders.find(o => o.id === orderId);
      if (!order) return;

      const updatedItems = order.items.map(item =>
        item.id === itemId ? { ...item, status } : item
      );

      // Convert KitchenOrderItem[] to Json type for Supabase
      const itemsForDb = updatedItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        status: item.status,
        notes: item.notes,
        menuItemId: item.menuItemId,
        startTime: item.startTime,
        cookingStation: item.cookingStation,
        assignedChef: item.assignedChef,
        modifications: item.modifications,
        allergenAlert: item.allergenAlert
      }));

      const { error } = await supabase
        .from('kitchen_orders')
        .update({ items: itemsForDb })
        .eq('id', orderId);

      if (error) throw error;

      setKitchenOrders(orders =>
        orders.map(order =>
          order.id === orderId ? { ...order, items: updatedItems } : order
        )
      );

      toast({
        title: "Item Updated",
        description: `Item status changed to ${status}`,
      });
    } catch (error) {
      console.error('Error updating item status:', error);
      toast({
        title: "Error",
        description: "Failed to update item status",
        variant: "destructive",
      });
    }
  };

  return {
    kitchenOrders,
    loading,
    updateOrderStatus,
    updateItemStatus,
  };
};
