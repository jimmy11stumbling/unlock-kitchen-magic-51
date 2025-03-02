
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export const orderApiService = {
  async getVendorOrders(vendorId: number): Promise<any[]> {
    // This would normally fetch from a dedicated orders table
    // For now returning simulated data
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
  },

  async getVendorPayments(vendorId: number): Promise<any[]> {
    // Fetch all transactions related to this vendor
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('type', 'expense')
      .eq('category_id', vendorId.toString())
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    // Transform to payment format
    return (data || []).map(transaction => ({
      id: transaction.id,
      date: transaction.date,
      amount: transaction.amount,
      method: transaction.payment_method,
      status: transaction.reference_number?.includes('completed') ? 'completed' : 'pending',
      reference: transaction.reference_number?.replace('completed-', '').replace('pending-', '') || ''
    }));
  },

  async createNewOrder(orderData: any): Promise<any> {
    // In a real implementation, this would create an order record
    // For now, we'll return a mock response
    const id = uuidv4();
    
    return {
      id,
      ...orderData,
      createdAt: new Date().toISOString()
    };
  },

  async createPayment(paymentData: any): Promise<any> {
    // Insert a financial transaction that represents a payment
    const statusRef = `${paymentData.status}-${Date.now()}`;
    
    const { data, error } = await supabase
      .from('financial_transactions')
      .insert({
        amount: paymentData.amount,
        category_id: paymentData.vendorId.toString(),
        date: paymentData.date,
        payment_method: paymentData.method,
        type: 'expense',
        reference_number: paymentData.reference ? `${statusRef}-${paymentData.reference}` : statusRef,
        created_by: uuidv4() // In a real app, this would be the authenticated user's ID
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      date: data.date,
      amount: data.amount,
      method: data.payment_method,
      status: paymentData.status,
      reference: paymentData.reference
    };
  },

  async generateOrderPdf(orderId: string): Promise<string> {
    // In a real implementation, this would generate a PDF
    // For now, we'll return a mock URL
    return `https://example.com/orders/${orderId}/pdf`;
  }
};
