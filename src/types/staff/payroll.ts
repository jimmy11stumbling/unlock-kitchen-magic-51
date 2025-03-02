
export interface PayrollSettings {
  accountType: string;
  accountNumber: string;
  routingNumber: string;
  directDeposit: boolean;
  federalTaxWithholding: number;
  stateTaxWithholding: number;
  healthInsurance?: number;
  retirementContribution?: number;
  otherDeductions?: {
    name: string;
    amount: number;
  }[];
  payFrequency: 'weekly' | 'biweekly' | 'monthly';
  // Add missing properties
  paymentMethod?: string;
  taxWithholding?: number;
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
  };
  netPay: number;
  status: 'pending' | 'processing' | 'completed' | 'error' | 'paid';
  totalPay: number;
  paymentDate?: string; // Add missing properties
  paymentMethod?: string;
}
