
import { supabase } from "@/integrations/supabase/client";
import type { Expense } from "@/types/vendor";
import { v4 as uuidv4 } from 'uuid';
import { mapTransactionToExpense } from "./utils/mappingUtils";

export const expenseApiService = {
  async getExpenses(): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('type', 'expense')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(mapTransactionToExpense);
  },

  async addExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'vendorName'>): Promise<Expense> {
    let vendorName = '';
    if (expense.vendorId) {
      const { data } = await supabase
        .from('financial_transactions')
        .select('description')
        .eq('id', expense.vendorId.toString())
        .maybeSingle();
        
      vendorName = data?.description || '';
    }
    
    const statusRef = expense.status === 'paid' ? 'paid-' + Date.now() : '';
    
    const { data, error } = await supabase
      .from('financial_transactions')
      .insert({
        amount: expense.amount,
        category_id: expense.vendorId.toString(),
        date: expense.date,
        description: expense.description,
        payment_method: expense.paymentMethod,
        type: 'expense',
        created_by: uuidv4(),
        reference_number: vendorName ? `${vendorName} ${statusRef}` : statusRef
      })
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create expense');
    
    return {
      ...mapTransactionToExpense(data),
      vendorName,
      vendorId: expense.vendorId,
      category: expense.category,
      taxDeductible: expense.taxDeductible,
      status: expense.status
    };
  },

  async updateExpense(id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'vendorName'>>): Promise<Expense> {
    let vendorName = '';
    if (updates.vendorId) {
      const { data } = await supabase
        .from('financial_transactions')
        .select('description')
        .eq('id', updates.vendorId.toString())
        .maybeSingle();
        
      vendorName = data?.description || '';
    }
    
    const statusRef = updates.status === 'paid' ? 'paid-' + Date.now() : '';
    
    const { data, error } = await supabase
      .from('financial_transactions')
      .update({
        amount: updates.amount,
        category_id: updates.vendorId?.toString(),
        date: updates.date,
        description: updates.description,
        payment_method: updates.paymentMethod,
        reference_number: vendorName ? `${vendorName} ${statusRef}` : statusRef
      })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Expense not found');
    
    return {
      ...mapTransactionToExpense(data),
      vendorName,
      vendorId: updates.vendorId || 0,
      category: updates.category || '',
      taxDeductible: updates.taxDeductible || false,
      status: updates.status || 'pending'
    };
  },

  async deleteExpense(id: string): Promise<void> {
    const { error } = await supabase
      .from('financial_transactions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
