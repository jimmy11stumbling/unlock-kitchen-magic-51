
import { supabase } from "@/integrations/supabase/client";
import { NewSupabaseOrder, SupabaseOrder } from "../types/orderTypes";
import type { KitchenOrder } from "@/types/staff";

export const orderService = {
  async fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createOrder(newOrderData: NewSupabaseOrder) {
    const { data, error } = await supabase
      .from('orders')
      .insert(newOrderData)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from insert');
    return data as SupabaseOrder;
  },

  async updateOrderStatus(orderId: number, status: string) {
    const { error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) throw error;
  },

  async updateKitchenOrderStatus(
    orderId: number,
    itemStatus: KitchenOrder['items'][0]['status']
  ) {
    const { data: existingOrder, error: fetchError } = await supabase
      .from('kitchen_orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (fetchError) throw fetchError;
    if (!existingOrder || !Array.isArray(existingOrder.items)) {
      throw new Error('Invalid kitchen order data');
    }

    const updatedItems = existingOrder.items.map((item: Record<string, any>) => ({
      ...item,
      status: itemStatus
    }));

    const { error: updateError } = await supabase
      .from('kitchen_orders')
      .update({ 
        items: updatedItems,
        updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId);

    if (updateError) throw updateError;
  }
};
