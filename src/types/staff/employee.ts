
export type StaffRole = 'manager' | 'chef' | 'server' | 'host' | 'bartender';
export type StaffStatus = 'active' | 'on_break' | 'off_duty';

export interface StaffMember {
  id: number;
  name: string;
  role: StaffRole;
  status: StaffStatus;
  shift: string;
  salary: number;
  hourlyRate?: number;
  overtimeRate?: number;
  email: string;
  phone: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  startDate: string;
  department: string;
  certifications: string[];
  performanceRating: number;
  notes: string;
  schedule: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  bankInfo: {
    accountNumber: string;
    routingNumber: string;
    accountType: "checking" | "savings";
  };
  payrollSettings?: PayrollSettings;
  taxInfo?: {
    ssn: string;
    w4Status: string;
    allowances: number;
    additionalWithholding: number;
  };
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface Shift {
  id: number;
  staffId: number;
  date: string;
  time: string;
}
