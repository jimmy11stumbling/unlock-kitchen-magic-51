
import { supabase } from '@/integrations/supabase/client';
import type { KitchenOrder } from '@/types';

export const orderService = {
  fetchOrders: async () => {
    const { data, error } = await supabase
      .from('kitchen_orders')
      .select('*');

    if (error) {
      throw error;
    }

    return data;
  },

  createOrder: async (orderData: Omit<KitchenOrder, 'id'>) => {
    const orderForDb = {
      order_id: orderData.orderId,
      items: orderData.items,
      priority: orderData.priority,
      notes: orderData.notes,
      coursing: orderData.coursing,
      created_at: orderData.created_at,
      updated_at: orderData.updated_at,
      estimated_delivery_time: orderData.estimated_delivery_time,
      table_number: orderData.table_number,
      server_name: orderData.server_name,
      status: orderData.status
    };

    const { data, error } = await supabase
      .from('kitchen_orders')
      .insert([orderForDb])
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

    const items = Array.isArray(order.items) ? order.items : [];
    const updatedItems = items.map(item => ({
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
