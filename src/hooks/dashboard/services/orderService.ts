
import { supabase } from '@/integrations/supabase/client';
import type { KitchenOrder, KitchenOrderItem } from '@/types';
import type { Database } from '@/types/database';

type SupabaseOrder = Database['public']['Tables']['kitchen_orders']['Row'];

const transformSupabaseOrder = (order: SupabaseOrder): KitchenOrder => {
  return {
    id: order.id,
    orderId: order.order_id || 0,
    items: Array.isArray(order.items) ? order.items : JSON.parse(order.items as string) as KitchenOrderItem[],
    priority: order.priority as KitchenOrder['priority'],
    notes: order.notes || '',
    coursing: order.coursing as KitchenOrder['coursing'],
    created_at: order.created_at,
    updated_at: order.updated_at,
    estimated_delivery_time: order.estimated_delivery_time,
    table_number: order.table_number || 0,
    server_name: order.server_name || '',
    status: order.status as KitchenOrder['status']
  };
};

export const orderService = {
  fetchOrders: async (): Promise<KitchenOrder[]> => {
    const { data, error } = await supabase
      .from('kitchen_orders')
      .select('*');

    if (error) throw error;
    return (data as SupabaseOrder[]).map(transformSupabaseOrder);
  },

  createOrder: async (orderData: Omit<KitchenOrder, 'id'>): Promise<KitchenOrder> => {
    const { data, error } = await supabase
      .from('kitchen_orders')
      .insert({
        order_id: orderData.orderId,
        items: JSON.stringify(orderData.items),
        priority: orderData.priority,
        notes: orderData.notes,
        coursing: orderData.coursing,
        created_at: orderData.created_at,
        updated_at: orderData.updated_at,
        estimated_delivery_time: orderData.estimated_delivery_time,
        table_number: orderData.table_number,
        server_name: orderData.server_name,
        status: orderData.status
      })
      .select()
      .single();

    if (error) throw error;
    return transformSupabaseOrder(data as SupabaseOrder);
  },

  updateOrderStatus: async (orderId: number, status: KitchenOrder['status']): Promise<KitchenOrder> => {
    const { data, error } = await supabase
      .from('kitchen_orders')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return transformSupabaseOrder(data as SupabaseOrder);
  },

  updateKitchenOrder: async (orderId: number, updates: Partial<KitchenOrder>): Promise<KitchenOrder> => {
    const supabaseUpdates: Partial<SupabaseOrder> = {
      ...updates,
      items: updates.items ? JSON.stringify(updates.items) : undefined,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('kitchen_orders')
      .update(supabaseUpdates)
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return transformSupabaseOrder(data as SupabaseOrder);
  }
};
