
// Re-export all types from their respective files
export * from './analytics';
export * from './inventory';
export * from './kitchen';
export * from './menu';
export * from './orders';
export * from './staff';
export * from './tables';
export * from './payroll';

// Add missing types and enums
export interface Message {
  id: number;
  content: string;
  timestamp: string;
  sender: string;
  recipient: string;
  status: 'sent' | 'delivered' | 'read';
}

export type StaffRole = 'manager' | 'chef' | 'server' | 'host' | 'bartender';

export interface StaffMember {
  id: number;
  name: string;
  role: StaffRole;
  status: 'active' | 'on_break' | 'off_duty';
  salary: number;
  hourlyRate?: number;
  email: string;
  phone: string;
  schedule: {
    [key: string]: string;
  };
  department: string;
  startDate: string;
  shift?: string;
  performanceRating?: number;
  payrollSettings?: {
    directDeposit: boolean;
    taxWithholding: number;
    benefits: string[];
  };
}
