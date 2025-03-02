
export interface Vendor {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
  status: 'active' | 'inactive' | 'pending';
  category: string;
  rating?: number;
}

export interface Expense {
  id: number;
  vendorId: number;
  amount: number;
  date: string;
  category: string;
  description: string;
  receipt?: string;
  paymentMethod: string;
  status: 'pending' | 'paid' | 'voided';
  taxDeductible: boolean;
  approvedBy?: string;
}

export interface VendorContact {
  id: string;
  vendorId: number;
  name: string;
  email: string;
  phone: string;
  title: string;
  primary?: boolean;
}

export interface VendorDocument {
  id: string;
  vendorId: number;
  name: string;
  type: string;
  uploadDate: string;
  fileUrl: string;
  description?: string;
}

export interface VendorOrder {
  id: string;
  vendorId: number;
  date: string;
  status: string;
  amount: number;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface VendorPayment {
  id: string;
  vendorId: number;
  date: string;
  amount: number;
  method: 'cash' | 'card' | 'bank_transfer' | 'check';
  status: string;
  reference: string;
}

export interface VendorNote {
  id: string;
  vendorId: number;
  content: string;
  createdAt: string;
  createdBy: string;
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
