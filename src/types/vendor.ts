
import type { Database } from "@/integrations/supabase/types";

export type PaymentMethod = Database["public"]["Enums"]["payment_method"];

export interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  status: 'active' | 'inactive';
  paymentTerms: PaymentMethod;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: number;
  vendorId: number;
  vendorName?: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  paymentMethod: PaymentMethod;
  receiptUrl?: string;
  taxDeductible: boolean;
  status: 'pending' | 'paid' | 'void';
  createdAt: string;
  updatedAt: string;
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

export interface VendorContact {
  id: string;
  vendorId: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface VendorOrder {
  id: string;
  vendorId: number;
  date: string;
  amount: number;
  status: string;
  items: OrderItem[];
}

export interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface VendorPayment {
  id: string;
  vendorId: number;
  date: string;
  amount: number;
  method: string;
  status: string;
  reference: string;
}

export interface VendorDocument {
  id: string;
  vendorId: number;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  url: string;
}

export interface VendorNote {
  id: string;
  vendorId: number;
  content: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

export interface BudgetAnalysis {
  monthlyBudgets: Record<string, {
    planned: number;
    actual: number;
    variance: number;
  }>;
  totalPlanned: number;
  totalActual: number;
}
