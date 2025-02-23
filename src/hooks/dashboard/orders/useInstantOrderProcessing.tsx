
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Order } from "@/types/staff";
import { useEffect } from "react";
import { determineStation, assignChef, validateOrderCompletion } from "@/utils/kitchenUtils";

export const useInstantOrderProcessing = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to new orders
    const channel = supabase
      .channel('instant-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        async (payload) => {
          const newOrder = payload.new as Order;
          
          // Create kitchen order immediately
          try {
            const kitchenOrderItems = newOrder.items.map(item => ({
              menuItemId: item.id,
              quantity: item.quantity,
              status: "pending",
              startTime: new Date().toISOString(),
              cookingStation: determineStation(item.id),
              assignedChef: assignChef(item.id),
              modifications: [],
              allergenAlert: false
            }));

            await supabase
              .from('kitchen_orders')
              .insert({
                order_id: newOrder.id,
                items: kitchenOrderItems,
                priority: "normal",
                notes: newOrder.specialInstructions || "",
                coursing: "standard",
                estimated_delivery_time: new Date(Date.now() + (newOrder.estimatedPrepTime * 60 * 1000)).toISOString()
              });

            toast({
              title: "New Order Received",
              description: `Order #${newOrder.id} has been sent to kitchen`,
            });
          } catch (error) {
            console.error("Error processing kitchen order:", error);
            toast({
              title: "Error Processing Order",
              description: "Failed to send order to kitchen",
              variant: "destructive"
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);
};

