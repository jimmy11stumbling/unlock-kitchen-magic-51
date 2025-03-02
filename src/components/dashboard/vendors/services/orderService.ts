
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import type { VendorOrder } from '@/types/vendor';
import type { Json } from '@/types/database';

export const orderService = {
  async getVendorOrders(vendorId: number): Promise<VendorOrder[]> {
    // For demonstration, we'll return simulated data
    // In a real implementation, you would fetch this from a database

    try {
      // Attempt to fetch recent orders from supabase for demonstration
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .limit(3);

      if (error) throw error;

      // Transform the data into the expected format
      const orders: VendorOrder[] = data?.map(order => ({
        id: uuidv4(),
        vendorId,
        date: order.created_at,
        status: 'delivered',
        amount: 0, // We'll need to calculate this if the total_amount property doesn't exist
        items: order.items as any[]
      })) || [];

      // If we couldn't get real data, add some simulated orders
      if (orders.length === 0) {
        return [
          {
            id: uuidv4(),
            vendorId,
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'delivered',
            amount: 1250.00,
            items: [
              { name: 'Organic Tomatoes', quantity: 10, unitPrice: 3.50 },
              { name: 'Fresh Basil', quantity: 5, unitPrice: 2.00 },
              { name: 'Olive Oil (1L)', quantity: 3, unitPrice: 15.00 }
            ]
          },
          {
            id: uuidv4(),
            vendorId,
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending',
            amount: 850.75,
            items: [
              { name: 'Free-Range Eggs', quantity: 120, unitPrice: 0.45 },
              { name: 'Organic Flour (5kg)', quantity: 8, unitPrice: 12.50 },
              { name: 'Cane Sugar (1kg)', quantity: 10, unitPrice: 3.25 }
            ]
          }
        ];
      }

      return orders;
    } catch (error) {
      console.error('Error fetching vendor orders:', error);
      return [];
    }
  }
};
