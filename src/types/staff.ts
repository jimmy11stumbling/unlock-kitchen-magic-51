
export type StaffStatus = "on_duty" | "off_duty" | "break" | "unavailable";
export type StaffRole = "manager" | "chef" | "server" | "host" | "kitchen_staff" | "bartender";

export interface StaffMember {
  id: number;
  name: string;
  role: StaffRole;
  status: StaffStatus;
  email?: string;
  phone?: string;
  schedule: { [key: string]: string };
  hourlyRate: number;
  performanceRating?: number;
  department?: string;
  certifications?: string[];
  salary?: number;
  shift?: string;
  address?: string;
  bankInfo?: {
    accountNumber: string;
    routingNumber: string;
    accountType: "checking" | "savings";
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
  startDate?: string;
  overtimeRate?: number;
  payrollSettings?: {
    taxWithholding: number;
    insuranceDeductions: number;
    retirement401k: number;
    directDeposit: boolean;
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
    tax: number;
    insurance: number;
    retirement: number;
    other: number;
  };
  netPay: number;
  status: 'pending' | 'processed' | 'paid';
  paymentDate: string;
  paymentMethod: 'direct_deposit' | 'check';
}

export interface Shift {
  id: number;
  staffId: number;
  startTime: string;
  endTime: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface CustomerFeedback {
  id: number;
  orderId: number;
  rating: number;
  comment: string;
  date: string;
  resolved: boolean;
}

export interface Promotion {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  active: boolean;
}
