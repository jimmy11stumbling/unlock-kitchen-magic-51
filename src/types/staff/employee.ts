
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
  status?: 'active' | 'on_leave' | 'terminated' | 'on_duty' | 'off_duty';
  department?: string;
  performanceRating?: number;
  address?: string;
  certifications?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  shift?: string;
  notes?: string;
  payrollEntries?: PayrollEntry[];
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
