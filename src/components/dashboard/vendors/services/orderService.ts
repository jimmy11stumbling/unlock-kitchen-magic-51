
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import type { VendorOrder } from '@/types/vendor';

export const orderService = {
  async getVendorOrders(vendorId: number): Promise<VendorOrder[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('vendor_id', vendorId);
      
      if (error) throw error;
      
      // Explicitly map the database results to our expected return type
      // to avoid excessive type instantiation
      if (data) {
        return data.map(order => ({
          id: order.id.toString(),
          date: order.created_at || new Date().toISOString(),
          status: order.status || 'completed',
          amount: order.total_amount || 0,
          items: order.items || []
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching vendor orders:', error);
      // Fallback to mock data if database query fails
      return [
        {
          id: uuidv4(),
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          amount: 1249.99,
          items: [
            { name: 'Premium Ingredients', quantity: 20, unitPrice: 25.00 },
            { name: 'Kitchen Supplies', quantity: 5, unitPrice: 150.00 }
          ]
        },
        {
          id: uuidv4(),
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          amount: 875.50,
          items: [
            { name: 'Cleaning Supplies', quantity: 10, unitPrice: 15.00 },
            { name: 'Specialty Ingredients', quantity: 15, unitPrice: 45.00 }
          ]
        }
      ];
    }
  },
  
  async createNewOrder(vendorId: number, orderData: any) {
    // Simulate creating a new order
    const newOrder = {
      id: uuidv4(),
      vendorId,
      ...orderData,
      date: new Date().toISOString(),
      status: "pending"
    };
    console.log("Creating new order:", newOrder);
    return newOrder;
  },

  async generateOrderPdf(orderId: string) {
    // Simulate generating a PDF
    console.log("Generating PDF for order:", orderId);
    // In a real application, this would generate and return a PDF file
    return {
      success: true,
      downloadUrl: `https://example.com/orders/pdf/${orderId}.pdf`
    };
  }
};
