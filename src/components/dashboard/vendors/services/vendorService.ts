
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { Vendor, Expense, AccountingSummary } from "@/types/vendor";

type FinancialTransaction = Database["public"]["Tables"]["financial_transactions"]["Row"];
type FinancialTransactionInsert = Database["public"]["Tables"]["financial_transactions"]["Insert"];

const mapTransactionToVendor = (transaction: FinancialTransaction): Vendor => ({
  id: Number(transaction.id),
  name: transaction.description || '',
  email: '',
  phone: '',
  address: '',
  taxId: transaction.reference_number || '',
  status: 'active',
  paymentTerms: transaction.payment_method,
  notes: '',
  createdAt: transaction.created_at || '',
  updatedAt: transaction.updated_at || ''
});

const mapTransactionToExpense = (transaction: FinancialTransaction): Expense => ({
  id: Number(transaction.id),
  vendorId: 0,
  amount: transaction.amount,
  date: transaction.date,
  category: transaction.category_id || '',
  description: transaction.description || '',
  paymentMethod: transaction.payment_method,
  receiptUrl: undefined,
  taxDeductible: false,
  status: 'pending',
  createdAt: transaction.created_at || '',
  updatedAt: transaction.updated_at || ''
});

export const vendorService = {
  async getVendors(): Promise<Vendor[]> {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('type', 'expense');
    
    if (error) throw error;
    return (data || []).map(mapTransactionToVendor);
  },

  async addVendor(vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vendor> {
    const { data, error } = await supabase
      .from('financial_transactions')
      .insert({
        amount: 0,
        category_id: '',
        date: new Date().toISOString(),
        description: vendor.name,
        payment_method: vendor.paymentTerms,
        type: 'expense',
        reference_number: vendor.taxId,
        created_by: ''
      })
      .select('*')
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('No data returned from insert');
    
    return mapTransactionToVendor(data);
  },

  async updateVendor(id: string, updates: Partial<Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Vendor> {
    const { data, error } = await supabase
      .from('financial_transactions')
      .update({
        description: updates.name,
        payment_method: updates.paymentTerms,
        reference_number: updates.taxId
      })
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('No data returned from update');
    
    return mapTransactionToVendor(data);
  },

  async getExpenses(): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('type', 'expense');
    
    if (error) throw error;
    return (data || []).map(mapTransactionToExpense);
  },

  async addExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    const { data, error } = await supabase
      .from('financial_transactions')
      .insert({
        amount: expense.amount,
        category_id: expense.category,
        date: expense.date,
        description: expense.description,
        payment_method: expense.paymentMethod,
        type: 'expense',
        created_by: '',
        reference_number: ''
      })
      .select('*')
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('No data returned from insert');
    
    return mapTransactionToExpense(data);
  },

  async getAccountingSummary(): Promise<AccountingSummary> {
    const expenses = await this.getExpenses();
    
    const summary: AccountingSummary = {
      totalExpenses: 0,
      totalPaid: 0,
      totalPending: 0,
      taxDeductibleAmount: 0,
      expensesByCategory: {},
      expensesByVendor: {},
      monthlyTotals: {}
    };

    expenses.forEach((expense) => {
      summary.totalExpenses += expense.amount;
      if (expense.status === 'paid') {
        summary.totalPaid += expense.amount;
      } else if (expense.status === 'pending') {
        summary.totalPending += expense.amount;
      }
      if (expense.taxDeductible) {
        summary.taxDeductibleAmount += expense.amount;
      }

      summary.expensesByCategory[expense.category] = 
        (summary.expensesByCategory[expense.category] || 0) + expense.amount;

      summary.expensesByVendor[expense.vendorId] = 
        (summary.expensesByVendor[expense.vendorId] || 0) + expense.amount;

      const month = expense.date.substring(0, 7);
      summary.monthlyTotals[month] = 
        (summary.monthlyTotals[month] || 0) + expense.amount;
    });

    return summary;
  }
};
