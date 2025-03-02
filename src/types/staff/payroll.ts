
export interface PayrollEntry {
  id: number;
  staffId: number;
  payPeriodStart: string;
  payPeriodEnd: string;
  regularHours: number;
  overtimeHours: number;
  regularRate: number;
  overtimeRate: number;
  grossPay: number;
  deductions: {
    tax: number;
    insurance: number;
    retirement: number;
    other: number;
  };
  netPay: number;
  status: 'pending' | 'processed' | 'paid';
  paymentDate: string;
  paymentMethod: 'direct_deposit' | 'check';
  checkNumber?: string;
  totalPay?: number;
}

export interface PayStub {
  id: number;
  payrollEntryId: number;
  staffId: number;
  generatedDate: string;
  documentUrl: string;
}

export interface PayrollSettings {
  payPeriod: 'weekly' | 'biweekly' | 'monthly';
  paymentMethod: 'direct_deposit' | 'check';
  taxWithholding: {
    federal: number;
    state: number;
    local: number;
  };
  benefits: {
    insurance: number;
    retirement: number;
  };
}
