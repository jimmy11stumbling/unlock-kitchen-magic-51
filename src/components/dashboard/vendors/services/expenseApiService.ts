
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import type { Expense } from '@/types/vendor';
import { mapTransactionToExpense } from './utils/mappingUtils';

// Type for valid payment methods
type ValidPaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'check';

export const expenseApiService = {
  async getExpenses(): Promise<Expense[]> {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('type', 'expense');
      
      if (error) throw error;
      
      return data.map(transaction => mapTransactionToExpense(transaction));
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }
  },
  
  async createExpense(expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    try {
      // Map the payment method to a valid database enum value
      const paymentMethod = mapToValidPaymentMethod(expenseData.paymentMethod);
      
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert({
          id: uuidv4(),
          type: 'expense',
          amount: expenseData.amount,
          date: expenseData.date,
          description: expenseData.description,
          payment_method: paymentMethod,
          reference_number: `EXP-${Date.now()}`,
          category_id: expenseData.category // This might need adjustment based on your schema
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return mapTransactionToExpense({
        ...data,
        vendor_id: expenseData.vendorId,
        vendor_name: expenseData.vendorName,
        category: expenseData.category,
        receipt_url: expenseData.receiptUrl,
        tax_deductible: expenseData.taxDeductible,
        status: expenseData.status
      });
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  },
  
  async updateExpense(id: number, updates: Partial<Expense>): Promise<Expense> {
    try {
      // Prepare updates in the format the database expects
      const dbUpdates: any = {};
      
      if (updates.amount) dbUpdates.amount = updates.amount;
      if (updates.date) dbUpdates.date = updates.date;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.paymentMethod) {
        // Map the payment method to a valid database enum value
        dbUpdates.payment_method = mapToValidPaymentMethod(updates.paymentMethod);
      }
      
      const { data, error } = await supabase
        .from('financial_transactions')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return mapTransactionToExpense({
        ...data,
        vendor_id: updates.vendorId || data.vendor_id,
        vendor_name: updates.vendorName || data.vendor_name,
        category: updates.category || data.category,
        receipt_url: updates.receiptUrl || data.receipt_url,
        tax_deductible: updates.taxDeductible ?? data.tax_deductible,
        status: updates.status || data.status
      });
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  }
};

// Helper function to map any payment method string to valid enum values
function mapToValidPaymentMethod(method: string): ValidPaymentMethod {
  const validMethods: Record<string, ValidPaymentMethod> = {
    'cash': 'cash',
    'card': 'card',
    'bank_transfer': 'bank_transfer',
    'bank transfer': 'bank_transfer',
    'check': 'check',
    'cheque': 'check'
  };
  
  return validMethods[method.toLowerCase()] || 'card'; // Default to card if invalid
}
