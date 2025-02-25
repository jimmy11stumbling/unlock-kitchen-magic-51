export interface CustomerFeedback {
  id: number;
  orderId: number;
  rating: number;
  comment?: string;
  date: string;
  resolved: boolean;
}

export interface Promotion {
  id: number;
  name: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  startDate: string;
  endDate: string;
  active: boolean;
  applicableItems: number[];
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
}

export interface Shift {
  id: number;
  staffId: number;
  startTime: string;
  endTime: string;
  date: string;
  time?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}
