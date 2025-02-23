
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { KitchenOrder } from "@/types/staff";
import { supabase } from "@/integrations/supabase/client";

export interface SupabaseKitchenOrder {
  id: number;
  order_id: number;
  items: any;
  priority: KitchenOrder["priority"];
  notes: string;
  coursing: KitchenOrder["coursing"];
  estimated_delivery_time: string;
  created_at: string;
  updated_at: string;
}

const mapSupabaseKitchenOrderToKitchenOrder = (order: SupabaseKitchenOrder): KitchenOrder => ({
  id: order.id,
  orderId: order.order_id,
  items: order.items,
  priority: order.priority,
  notes: order.notes,
  coursing: order.coursing,
  estimatedDeliveryTime: order.estimated_delivery_time,
});

export const useKitchenOrders = () => {
  const { toast } = useToast();
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKitchenOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('kitchen_orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setKitchenOrders(data.map(mapSupabaseKitchenOrderToKitchenOrder));
      } catch (error) {
        console.error('Error fetching kitchen orders:', error);
        toast({
          title: "Error fetching kitchen orders",
          description: "Could not load kitchen orders. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchKitchenOrders();
  }, [toast]);

  return { kitchenOrders, isLoading };
};
