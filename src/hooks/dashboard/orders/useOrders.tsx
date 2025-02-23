
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Order } from "@/types/staff";
import { supabase } from "@/integrations/supabase/client";

export interface SupabaseOrder {
  id: number;
  table_number: number;
  guest_count: number;
  items: any;
  status: string;
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
  try {
    if (!order) throw new Error("Invalid order data: Order is null or undefined");
    if (!isValidOrderStatus(order.status)) {
      throw new Error(`Invalid order status: ${order.status}`);
    }
    if (!Array.isArray(JSON.parse(JSON.stringify(order.items)))) {
      throw new Error("Invalid items format: Expected an array");
    }

    return {
      id: order.id,
      tableNumber: order.table_number,
      items: order.items,
      status: order.status,
      total: order.total,
      timestamp: order.timestamp,
      serverName: order.server_name,
      specialInstructions: order.special_instructions,
      guestCount: order.guest_count,
      estimatedPrepTime: order.estimated_prep_time,
    };
  } catch (error) {
    throw new Error(`Error mapping order data: ${error.message}`);
  }
};

export const useOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (supabaseError) throw supabaseError;
        if (!data) throw new Error("No data returned from database");

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
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error('Error fetching orders:', error);
        setError(errorMessage);
        toast({
          title: "Error fetching orders",
          description: errorMessage,
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
        async (payload) => {
          try {
            const mappedOrder = mapSupabaseOrderToOrder(payload.new as SupabaseOrder);
            
            if (payload.eventType === 'INSERT') {
              setOrders(prev => [mappedOrder, ...prev]);
              toast({
                title: "New Order",
                description: `Order #${mappedOrder.id} has been created`,
              });
            } else if (payload.eventType === 'UPDATE') {
              setOrders(prev => prev.map(order => 
                order.id === mappedOrder.id ? mappedOrder : order
              ));
              toast({
                title: "Order Updated",
                description: `Order #${mappedOrder.id} has been updated`,
              });
            } else if (payload.eventType === 'DELETE') {
              setOrders(prev => prev.filter(order => order.id !== payload.old.id));
              toast({
                title: "Order Removed",
                description: `Order #${payload.old.id} has been removed`,
              });
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

  return { orders, isLoading, error };
};
