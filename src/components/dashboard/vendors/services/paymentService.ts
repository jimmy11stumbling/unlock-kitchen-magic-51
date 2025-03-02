
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import type { VendorPayment } from '@/types/vendor';

export const paymentService = {
  async getVendorPayments(vendorId: number): Promise<VendorPayment[]> {
    try {
      // Try to fetch from financial_transactions table
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
    } catch (error) {
      console.error('Error fetching vendor payments:', error);
      // Fallback to mock data
      return [
        {
          id: uuidv4(),
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 2500.00,
          method: 'bank_transfer',
          status: 'completed',
          reference: 'INV-2023-001'
        },
        {
          id: uuidv4(),
          date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 1875.50,
          method: 'check',
          status: 'completed',
          reference: 'INV-2023-002'
        }
      ];
    }
  },
  
  async createPayment(paymentData: any) {
    // Simulate creating a payment
    const newPayment = {
      id: uuidv4(),
      ...paymentData,
      date: new Date().toISOString(),
      status: "completed"
    };
    console.log("Creating payment:", newPayment);
    return newPayment;
  }
};
