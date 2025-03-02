
export type StaffStatus = "active" | "on_break" | "off_duty";
export type StaffRole = "manager" | "server" | "chef" | "bartender" | "host";

export interface StaffMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: StaffStatus;
  schedule: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  certifications: string[];
  performance_rating: number;
  notes: string;
  department?: string;
  address?: string;
  salary?: number;
  hourlyRate?: number;
  overtimeRate?: number;
  shift?: string;
  startDate?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  bankInfo?: {
    accountNumber: string;
    routingNumber: string;
    accountType: "checking" | "savings";
  };
  payrollSettings?: {
    paymentMethod: "direct_deposit" | "check";
    taxWithholding: {
      federal: number;
      state: number;
      local: number;
    };
    benefits: {
      insurance: string;
      retirement: string;
      other: string[];
    };
  };
  payrollEntries?: PayrollEntry[];
}

export interface Shift {
  id: number;
  staffId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "completed" | "cancelled";
}
