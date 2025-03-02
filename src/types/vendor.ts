
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
  fileUrl?: string;
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
}
