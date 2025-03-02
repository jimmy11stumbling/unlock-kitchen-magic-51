
import { PayrollEntry, PayrollSettings } from './payroll';

export type StaffStatus = 'active' | 'on_leave' | 'terminated' | 'on_duty' | 'off_duty' | 'on_break';

export interface StaffMember {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  role: 'manager' | 'chef' | 'server' | 'bartender' | 'host';
  hireDate: string;
  schedule?: Record<string, string>;
  hourlyRate?: number;
  overtimeRate?: number;
  status?: StaffStatus;
  department?: string;
  performanceRating?: number;
  performance_rating?: number; // For backward compatibility
  address?: string;
  certifications?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  shift?: string;
  notes?: string;
  salary?: number; // Add missing property
  payrollSettings?: PayrollSettings;
  payrollEntries?: PayrollEntry[];
  startDate?: string; // Add missing property
  bankInfo?: any; // Add missing property
}

export interface Shift {
  id: number;
  staffId: number;
  date: string;
  startTime: string;
  endTime: string;
  status?: 'scheduled' | 'completed' | 'missed' | 'in_progress';
  notes?: string;
}
