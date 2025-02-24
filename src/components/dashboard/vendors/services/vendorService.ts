
import { supabase } from "@/integrations/supabase/client";
import type { Vendor, Expense, AccountingSummary } from "@/types/vendor";
import type { Database } from "@/integrations/supabase/types";

type VendorRow = Database["public"]["Tables"]["financial_transactions"]["Row"];
type VendorInsert = Database["public"]["Tables"]["financial_transactions"]["Insert"];

const mapTransactionToVendor = (item: VendorRow): Vendor => ({
  id: Number(item.id),
  name: item.category,
  email: '',
  phone: '',
  address: item.description || '',
  taxId: '',
  status: 'active',
  paymentTerms: item.payment_method || '',
  notes: item.notes || '',
  createdAt: item.created_at || '',
  updatedAt: item.created_at || ''
});

const mapVendorToTransaction = (vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>): VendorInsert => ({
  category: vendor.name,
  description: vendor.address,
  payment_method: vendor.paymentTerms,
  notes: vendor.notes,
  type: 'expense',
  amount: 0,
  user_id: ''
});

export const vendorService = {
  async getVendors(): Promise<Vendor[]> {
    const { data } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('type', 'expense')
      .order('category');
    
    return (data || []).map(mapTransactionToVendor);
  },

  async addVendor(vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vendor> {
    const { data } = await supabase
      .from('financial_transactions')
      .insert([mapVendorToTransaction(vendor)])
      .select()
      .single();
    
    if (!data) throw new Error('No data returned from insert');
    
    return mapTransactionToVendor(data);
  },

  async updateVendor(id: number, updates: Partial<Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Vendor> {
    const { data } = await supabase
      .from('financial_transactions')
      .update({
        category: updates.name,
        description: updates.address,
        payment_method: updates.paymentTerms,
        notes: updates.notes
      })
      .eq('id', id)
      .select()
      .single();
    
    if (!data) throw new Error('No data returned from update');
    
    return mapTransactionToVendor(data);
  },

  async getExpenses(): Promise<Expense[]> {
    const { data } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('type', 'expense');
    
    return (data || []).map(item => ({
      id: Number(item.id),
      vendorId: 0,
      amount: item.amount,
      date: item.date || '',
      category: item.category || '',
      description: item.description || '',
      paymentMethod: item.payment_method || '',
      receiptUrl: undefined,
      taxDeductible: false,
      status: 'pending',
      createdAt: item.created_at || '',
      updatedAt: item.created_at || ''
    }));
  },

  async addExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    const { data } = await supabase
      .from('financial_transactions')
      .insert([{
        amount: expense.amount,
        date: expense.date,
        category: expense.category,
        description: expense.description,
        payment_method: expense.paymentMethod,
        type: 'expense',
        user_id: ''
      }])
      .select()
      .single();
    
    if (!data) throw new Error('No data returned from insert');
    
    return {
      id: Number(data.id),
      vendorId: 0,
      amount: data.amount,
      date: data.date || '',
      category: data.category || '',
      description: data.description || '',
      paymentMethod: data.payment_method || '',
      receiptUrl: undefined,
      taxDeductible: false,
      status: 'pending',
      createdAt: data.created_at || '',
      updatedAt: data.created_at || ''
    };
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
