
import type { Json } from "@/integrations/supabase/types";

export interface VendorRow {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  tax_id: string | null;
  status: 'active' | 'inactive';
  payment_terms: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpenseRow {
  id: number;
  vendor_id: number;
  amount: number;
  date: string;
  category: string | null;
  description: string | null;
  payment_method: string | null;
  receipt_url: string | null;
  tax_deductible: boolean;
  status: 'pending' | 'paid' | 'void';
  created_at: string;
  updated_at: string;
}
