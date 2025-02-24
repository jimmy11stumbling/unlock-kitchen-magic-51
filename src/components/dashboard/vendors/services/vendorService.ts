
import { supabase } from "@/integrations/supabase/client";
import type { Vendor, Expense, AccountingSummary } from "@/types/vendor";
import type { VendorRow, ExpenseRow } from "@/types/databaseTypes";

const createVendorsTable = async () => {
  const { error } = await supabase.rpc('execute_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS vendors (
        id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        address TEXT,
        tax_id TEXT,
        status TEXT DEFAULT 'active',
        payment_terms TEXT,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `
  });
  
  if (error) {
    console.error('Error creating vendors table:', error);
  }
};

const createExpensesTable = async () => {
  const { error } = await supabase.rpc('execute_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS expenses (
        id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        vendor_id BIGINT REFERENCES vendors(id),
        amount NUMERIC NOT NULL,
        date DATE NOT NULL,
        category TEXT,
        description TEXT,
        payment_method TEXT,
        receipt_url TEXT,
        tax_deductible BOOLEAN DEFAULT false,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `
  });
  
  if (error) {
    console.error('Error creating expenses table:', error);
  }
};

const mapVendorRowToVendor = (item: VendorRow): Vendor => ({
  id: item.id,
  name: item.name,
  email: item.email || '',
  phone: item.phone || '',
  address: item.address || '',
  taxId: item.tax_id || '',
  status: item.status,
  paymentTerms: item.payment_terms || '',
  notes: item.notes || '',
  createdAt: item.created_at,
  updatedAt: item.updated_at
});

const mapExpenseRowToExpense = (item: ExpenseRow): Expense => ({
  id: item.id,
  vendorId: item.vendor_id,
  amount: item.amount,
  date: item.date,
  category: item.category || '',
  description: item.description || '',
  paymentMethod: item.payment_method || '',
  receiptUrl: item.receipt_url || undefined,
  taxDeductible: item.tax_deductible,
  status: item.status,
  createdAt: item.created_at,
  updatedAt: item.updated_at
});

export const vendorService = {
  async getVendors() {
    await createVendorsTable();
    
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('name')
      .returns<VendorRow[]>();
    
    if (error) throw error;
    
    return (data || []).map(mapVendorRowToVendor);
  },

  async addVendor(vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('vendors')
      .insert([{
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        address: vendor.address,
        tax_id: vendor.taxId,
        status: vendor.status,
        payment_terms: vendor.paymentTerms,
        notes: vendor.notes
      }])
      .select()
      .returns<VendorRow[]>()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('No data returned from insert');
    
    return mapVendorRowToVendor(data);
  },

  async updateVendor(id: number, updates: Partial<Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>>) {
    const { data, error } = await supabase
      .from('vendors')
      .update({
        name: updates.name,
        email: updates.email,
        phone: updates.phone,
        address: updates.address,
        tax_id: updates.taxId,
        status: updates.status,
        payment_terms: updates.paymentTerms,
        notes: updates.notes
      })
      .eq('id', id)
      .select()
      .returns<VendorRow[]>()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('No data returned from update');
    
    return mapVendorRowToVendor(data);
  },

  async getExpenses() {
    await createExpensesTable();
    
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        vendors (
          name
        )
      `)
      .returns<ExpenseRow[]>();
    
    if (error) throw error;
    
    return (data || []).map(mapExpenseRowToExpense);
  },

  async addExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('expenses')
      .insert([{
        vendor_id: expense.vendorId,
        amount: expense.amount,
        date: expense.date,
        category: expense.category,
        description: expense.description,
        payment_method: expense.paymentMethod,
        receipt_url: expense.receiptUrl,
        tax_deductible: expense.taxDeductible,
        status: expense.status
      }])
      .select()
      .returns<ExpenseRow[]>()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('No data returned from insert');
    
    return mapExpenseRowToExpense(data);
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
