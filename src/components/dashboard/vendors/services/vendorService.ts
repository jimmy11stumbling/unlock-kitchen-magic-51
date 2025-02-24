import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export interface Vendor {
  id: number;
  name: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

type FinancialTransaction = Database["public"]["Tables"]["financial_transactions"]["Row"];
type FinancialTransactionInsert = Database["public"]["Tables"]["financial_transactions"]["Insert"];

const mapTransactionToVendor = (transaction: FinancialTransaction): Vendor => ({
  id: Number(transaction.id),
  name: transaction.description || '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  description: transaction.notes || '',
  createdAt: transaction.created_at,
  updatedAt: transaction.updated_at
});

export const vendorService = {
  async getVendors(): Promise<Vendor[]> {
    const { data } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('type', 'expense');
    
    return (data || []).map(mapTransactionToVendor);
  },
  async getExpenses(): Promise<FinancialTransaction[]> {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('type', 'expense');

    if (error) {
      console.error("Error fetching expenses:", error);
      return [];
    }

    return data || [];
  },

  async getAccountingSummary(): Promise<{
    totalExpenses: number;
    totalPaid: number;
    totalPending: number;
    taxDeductibleAmount: number;
    expensesByCategory: { [category: string]: number };
    expensesByVendor: { [vendor: string]: number };
    monthlyTotals: { [month: string]: number };
  }> {
    const { data, error } = await supabase.rpc('get_accounting_summary');

    if (error) {
      console.error("Error fetching accounting summary:", error);
      return {
        totalExpenses: 0,
        totalPaid: 0,
        totalPending: 0,
        taxDeductibleAmount: 0,
        expensesByCategory: {},
        expensesByVendor: {},
        monthlyTotals: {}
      };
    }

    return data?.[0] || {
      totalExpenses: 0,
      totalPaid: 0,
      totalPending: 0,
      taxDeductibleAmount: 0,
      expensesByCategory: {},
      expensesByVendor: {},
      monthlyTotals: {}
    };
  },

  async addVendor(vendor: Omit<Vendor, 'id'>): Promise<Vendor | null> {
    const transactionInsert: FinancialTransactionInsert = {
      type: 'expense',
      description: vendor.name,
      amount: 0,
      date: new Date().toISOString(),
      notes: vendor.description || '',
    };

    const { data, error } = await supabase
      .from('financial_transactions')
      .insert([transactionInsert])
      .select()
      .single();

    if (error) {
      console.error("Error adding vendor:", error);
      return null;
    }

    return mapTransactionToVendor(data);
  },

  async updateVendor(id: string, updates: Partial<Vendor>): Promise<Vendor | null> {
    const transactionUpdates: Partial<FinancialTransactionInsert> = {
      description: updates.name,
      notes: updates.description,
    };

    const { data, error } = await supabase
      .from('financial_transactions')
      .update(transactionUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating vendor:", error);
      return null;
    }

    return mapTransactionToVendor(data);
  },

  async deleteVendor(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('financial_transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting vendor:", error);
      return false;
    }

    return true;
  },
};
