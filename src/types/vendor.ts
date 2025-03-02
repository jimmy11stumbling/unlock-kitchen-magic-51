
export interface Vendor {
  id: number;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  paymentTerms: string;
  notes?: string;
  rating?: number;
  contacts?: VendorContact[];
  documents?: VendorDocument[];
}

export interface Expense {
  id: number;
  vendorId: number;
  vendorName: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  paymentMethod: string;
  status: 'paid' | 'pending' | 'overdue';
  receiptUrl?: string;
  notes?: string;
  approvedBy?: string;
  approvedDate?: string;
  taxDeductible?: boolean;
}

export interface VendorContact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  primary?: boolean;
}

export interface VendorNote {
  id: string;
  vendorId: number;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface VendorDocument {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  uploadedAt: string;
  size: number;
}

export interface VendorOrder {
  id: string;
  vendorId: number;
  date: string;
  status: string;
  amount: number;
  items: any[];
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

export interface AccountingSummary {
  id: string;
  total: number;
  paid: number;
  overdue: number;
  lastMonthExpenses?: number;
  totalExpenses: number;
  totalPaid: number;
  totalPending: number;
  taxDeductibleAmount?: number;
  expensesByCategory: Record<string, number>;
  expensesByVendor: Record<string, number>;
  monthlyTotals: Record<string, number>;
}
