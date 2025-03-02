
import type { Database } from "@/integrations/supabase/types";
import type { Vendor, Expense } from "@/types/vendor";

type FinancialTransaction = Database["public"]["Tables"]["financial_transactions"]["Row"];

export const mapTransactionToVendor = (transaction: FinancialTransaction): Vendor => ({
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

export const mapTransactionToExpense = (transaction: FinancialTransaction): Expense => ({
  id: Number(transaction.id),
  vendorId: transaction.category_id ? Number(transaction.category_id) : 0,
  vendorName: transaction.reference_number || undefined,
  amount: transaction.amount,
  date: transaction.date,
  category: transaction.category_id || '',
  description: transaction.description || '',
  paymentMethod: transaction.payment_method,
  receiptUrl: undefined,
  taxDeductible: false,
  status: transaction.reference_number?.includes('paid') ? 'paid' : 'pending',
  createdAt: transaction.created_at || '',
  updatedAt: transaction.updated_at || ''
});
