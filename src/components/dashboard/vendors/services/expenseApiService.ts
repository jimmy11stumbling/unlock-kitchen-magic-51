
import { supabase } from '@/integrations/supabase/client';
import type { Expense } from '@/types/vendor';
import { v4 as uuidv4 } from 'uuid';

export const mapTransactionToExpense = (transaction: any): Expense => {
  return {
    id: parseInt(transaction.id) || 0,
    vendorId: parseInt(transaction.vendor_id) || 0,
    vendorName: transaction.vendor_name || '',
    amount: transaction.amount || 0,
    date: transaction.date || new Date().toISOString().split('T')[0],
    description: transaction.description || '',
    category: transaction.category || transaction.category_id || '',
    paymentMethod: transaction.payment_method || 'cash',
    status: transaction.status || 'pending',
    receiptUrl: transaction.receipt_url || '',
    notes: transaction.notes || '',
    taxDeductible: transaction.tax_deductible || false,
    createdAt: transaction.created_at || new Date().toISOString(),
    updatedAt: transaction.updated_at || new Date().toISOString(),
  };
};

export const expenseApiService = {
  async getAllExpenses(): Promise<Expense[]> {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('type', 'expense');

      if (error) throw error;
      
      return (data || []).map(mapTransactionToExpense);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }
  },

  async createExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    try {
      // Convert payment method to a valid enum value if needed
      let paymentMethod = expense.paymentMethod;
      if (!['cash', 'card', 'bank_transfer', 'check'].includes(paymentMethod)) {
        paymentMethod = 'cash'; // Default to cash if invalid
      }

      const { data, error } = await supabase
        .from('financial_transactions')
        .insert({
          id: uuidv4(),
          amount: expense.amount,
          date: expense.date,
          description: expense.description,
          payment_method: paymentMethod as "cash" | "card" | "bank_transfer" | "check",
          type: 'expense',
          // Store vendor and category in metadata or reference_number
          reference_number: `vendor:${expense.vendorId},category:${expense.category}`
        })
        .select()
        .single();

      if (error) throw error;

      // Create the response with all the fields from the Expense type
      const newExpense: Expense = {
        id: parseInt(data.id) || 0,
        vendorId: expense.vendorId,
        vendorName: expense.vendorName,
        amount: data.amount,
        date: data.date,
        description: data.description,
        category: expense.category, // Using the provided category
        paymentMethod: data.payment_method,
        receiptUrl: expense.receiptUrl || '',
        taxDeductible: expense.taxDeductible || false,
        status: expense.status || 'pending',
        notes: expense.notes || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      return newExpense;
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  },

  async getExpenseById(id: number): Promise<Expense | null> {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('id', id.toString())
        .eq('type', 'expense')
        .single();

      if (error) throw error;
      if (!data) return null;

      return mapTransactionToExpense(data);
    } catch (error) {
      console.error(`Error fetching expense with ID ${id}:`, error);
      return null;
    }
  }
};
