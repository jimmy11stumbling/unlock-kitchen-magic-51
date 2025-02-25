
export type StaffStatus = "on_duty" | "off_duty" | "break" | "unavailable";
export type StaffRole = "manager" | "chef" | "server" | "host" | "kitchen_staff";

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
