
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
  netPay: number;
  deductions: {
    tax: number;
    insurance?: number;
    retirement?: number;
    other?: number;
  };
  status: 'pending' | 'processing' | 'completed' | 'error';
  paymentDate?: string;
  paymentMethod?: string;
  totalPay?: number;
}

export interface PayrollSettings {
  taxRate: number;
  overtimeThreshold: number;
  overtimeMultiplier: number;
  deductionRates: {
    insurance: number;
    retirement: number;
  };
  paySchedule: 'weekly' | 'biweekly' | 'monthly';
}
