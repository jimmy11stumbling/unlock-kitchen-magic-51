
import { supabase } from '@/integrations/supabase/client';
import type { KitchenOrder } from '@/types';

export const orderService = {
  fetchOrders: async () => {
    const { data, error } = await supabase
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
      `);

    if (error) {
      throw error;
    }

    return data;
  },

  createOrder: async (orderData: Omit<KitchenOrder, 'id'>) => {
    const { data, error } = await supabase
      .from('kitchen_orders')
      .insert([orderData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  updateOrderStatus: async (orderId: number, status: KitchenOrder['status']) => {
    const { error } = await supabase
      .from('kitchen_orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      throw error;
    }
  },

  updateKitchenOrderStatus: async (orderId: number, itemStatus: string) => {
    const { data: order, error: fetchError } = await supabase
      .from('kitchen_orders')
      .select('items')
      .eq('id', orderId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    const updatedItems = order.items.map((item: any) => ({
      ...item,
      status: itemStatus,
    }));

    const { error: updateError } = await supabase
      .from('kitchen_orders')
      .update({ items: updatedItems })
      .eq('id', orderId);

    if (updateError) {
      throw updateError;
    }
  },
};
