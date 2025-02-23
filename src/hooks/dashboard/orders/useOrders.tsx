
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Order } from "@/types/staff";
import { supabase } from "@/integrations/supabase/client";

export interface SupabaseOrder {
  id: number;
  table_number: number;
  guest_count: number;
  items: any;
  status: string;  // Changed from Order["status"] to string since that's what Supabase returns
  total: number;
  timestamp: string;
  server_name: string;
  special_instructions?: string;
  estimated_prep_time: number;
  created_at: string;
  updated_at: string;
}

const isValidOrderStatus = (status: string): status is Order["status"] => {
  return ["pending", "preparing", "ready", "delivered"].includes(status);
};

const mapSupabaseOrderToOrder = (order: SupabaseOrder): Order => {
  if (!isValidOrderStatus(order.status)) {
    throw new Error(`Invalid order status: ${order.status}`);
  }

  return {
    id: order.id,
    tableNumber: order.table_number,
    items: order.items,
    status: order.status, // TypeScript now knows this is a valid Order["status"]
    total: order.total,
    timestamp: order.timestamp,
    serverName: order.server_name,
    specialInstructions: order.special_instructions,
    guestCount: order.guest_count,
    estimatedPrepTime: order.estimated_prep_time,
  };
};

export const useOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Try to map each order, show toast for any invalid orders
        const mappedOrders = data
          .map(raw => {
            try {
              return mapSupabaseOrderToOrder(raw as SupabaseOrder);
            } catch (e) {
              console.error('Error mapping order:', e);
              toast({
                title: "Invalid order data",
                description: `Order #${raw.id}: ${e.message}`,
                variant: "destructive"
              });
              return null;
            }
          })
          .filter((order): order is Order => order !== null);

        setOrders(mappedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error fetching orders",
          description: "Could not load orders. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    const ordersSubscription = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          try {
            const mappedOrder = mapSupabaseOrderToOrder(payload.new as SupabaseOrder);
            if (payload.eventType === 'INSERT') {
              setOrders(prev => [mappedOrder, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setOrders(prev => prev.map(order => 
                order.id === mappedOrder.id ? mappedOrder : order
              ));
            }
          } catch (e) {
            console.error('Error processing order update:', e);
            toast({
              title: "Invalid order data",
              description: e.message,
              variant: "destructive"
            });
          }
        }
      )
      .subscribe();

    fetchOrders();

    return () => {
      ordersSubscription.unsubscribe();
    };
  }, [toast]);

  return { orders, isLoading };
};
