
export interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  status: 'active' | 'inactive';
  paymentTerms: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: number;
  vendorId: number;
  amount: number;
  date: string;
  category: string;
  description: string;
  paymentMethod: string;
  receiptUrl?: string;
  taxDeductible: boolean;
  status: 'pending' | 'paid' | 'void';
  createdAt: string;
  updatedAt: string;
}

export interface TaxCategory {
  id: number;
  name: string;
  description: string;
  rate: number;
  deductible: boolean;
}

export interface AccountingSummary {
  totalExpenses: number;
  totalPaid: number;
  totalPending: number;
  taxDeductibleAmount: number;
  expensesByCategory: Record<string, number>;
  expensesByVendor: Record<string, number>;
  monthlyTotals: Record<string, number>;
}
