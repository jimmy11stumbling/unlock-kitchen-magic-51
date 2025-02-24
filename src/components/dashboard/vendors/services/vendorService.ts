
import { supabase } from "@/integrations/supabase/client";
import type { Vendor, Expense, AccountingSummary } from "@/types/vendor";
import { calculateTax } from "@/utils/taxCalculator";

export const vendorService = {
  async getVendors() {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as Vendor[];
  },

  async addVendor(vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('vendors')
      .insert([{ ...vendor, createdAt: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Vendor;
  },

  async updateVendor(id: number, updates: Partial<Vendor>) {
    const { data, error } = await supabase
      .from('vendors')
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Vendor;
  },

  async getExpenses() {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        vendor:vendors(name)
      `)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data as Expense[];
  },

  async addExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('expenses')
      .insert([{ ...expense, createdAt: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Expense;
  },

  async getAccountingSummary(): Promise<AccountingSummary> {
    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('*');
    
    if (error) throw error;

    const summary: AccountingSummary = {
      totalExpenses: 0,
      totalPaid: 0,
      totalPending: 0,
      taxDeductibleAmount: 0,
      expensesByCategory: {},
      expensesByVendor: {},
      monthlyTotals: {}
    };

    expenses.forEach((expense: Expense) => {
      summary.totalExpenses += expense.amount;
      if (expense.status === 'paid') {
        summary.totalPaid += expense.amount;
      } else if (expense.status === 'pending') {
        summary.totalPending += expense.amount;
      }
      if (expense.taxDeductible) {
        summary.taxDeductibleAmount += expense.amount;
      }

      // Calculate category totals
      summary.expensesByCategory[expense.category] = 
        (summary.expensesByCategory[expense.category] || 0) + expense.amount;

      // Calculate vendor totals
      summary.expensesByVendor[expense.vendorId] = 
        (summary.expensesByVendor[expense.vendorId] || 0) + expense.amount;

      // Calculate monthly totals
      const month = expense.date.substring(0, 7); // YYYY-MM
      summary.monthlyTotals[month] = 
        (summary.monthlyTotals[month] || 0) + expense.amount;
    });

    return summary;
  }
};
