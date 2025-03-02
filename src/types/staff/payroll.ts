
export interface PayrollSettings {
  accountType?: string;
  accountNumber?: string;
  routingNumber?: string;
  directDeposit?: boolean;
  federalTaxWithholding?: number;
  stateTaxWithholding?: number;
  healthInsurance?: number;
  retirementContribution?: number;
  otherDeductions?: {
    name: string;
    amount: number;
  }[];
  payFrequency?: 'weekly' | 'biweekly' | 'monthly';
  paymentMethod?: string;
  taxWithholding?: {
    federal: number;
    state: number;
    local: number;
  };
  // Add properties used in PayrollSettings component
  taxRate?: number;
  overtimeThreshold?: number;
  overtimeMultiplier?: number;
  paySchedule?: 'weekly' | 'biweekly' | 'monthly';
  deductionRates?: {
    insurance: number;
    retirement: number;
  };
}

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
    federalTax: number;
    stateTax: number;
    medicareTax: number;
    socialSecurityTax: number;
    healthInsurance?: number;
    retirement?: number;
    other?: number;
    tax?: number; // For backward compatibility
    insurance?: number;
  };
  netPay: number;
  status: 'pending' | 'processing' | 'completed' | 'error' | 'paid';
  totalPay: number;
  paymentDate?: string;
  paymentMethod?: string;
}
