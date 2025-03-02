
import type { StaffMember } from '@/types/staff';
import type { Json } from '@/integrations/supabase/types';

// Define the database staff type
interface DatabaseStaffMember {
  id: number;
  name: string;
  role: 'manager' | 'chef' | 'server' | 'bartender' | 'host';
  email?: string;
  phone?: string;
  address?: string;
  department?: string;
  certifications?: string[];
  performance_rating?: number;
  status?: 'active' | 'on_break' | 'off_duty';
  notes?: string;
  schedule?: Json;
  salary?: number;
  hourly_rate?: number;
  overtime_rate?: number;
  shift?: string;
  emergency_contact?: Json;
  bank_info?: Json;
  benefits?: Json;
  employment_status?: 'full_time' | 'part_time' | 'contract' | 'terminated';
  tax_id?: string;
  created_at?: string;
  updated_at?: string;
  // Newly added for compatibility
  hire_date?: string;
  start_date?: string;
}

// Map database staff member to app staff member
export const mapDatabaseToStaffMember = (dbStaff: DatabaseStaffMember): StaffMember => {
  // Map status from database to app format
  let appStatus: StaffMember['status'] = 'active';
  
  if (dbStaff.status === 'on_break') {
    appStatus = 'on_break';
  } else if (dbStaff.status === 'off_duty') {
    appStatus = 'off_duty';
  } else if (dbStaff.employment_status === 'terminated') {
    appStatus = 'terminated';
  } else if (dbStaff.status === 'active') {
    appStatus = 'active';
  }
  
  return {
    id: dbStaff.id,
    name: dbStaff.name,
    role: dbStaff.role,
    email: dbStaff.email || '',
    phone: dbStaff.phone || '',
    address: dbStaff.address || '',
    department: dbStaff.department || '',
    hireDate: dbStaff.hire_date || dbStaff.start_date || new Date().toISOString(),
    schedule: dbStaff.schedule as Record<string, string> || {},
    hourlyRate: dbStaff.hourly_rate || 0,
    overtimeRate: dbStaff.overtime_rate || 0,
    status: appStatus,
    shift: dbStaff.shift || '',
    salary: dbStaff.salary || 0,
    certifications: dbStaff.certifications || [],
    performanceRating: dbStaff.performance_rating || 0,
    notes: dbStaff.notes || '',
    emergencyContact: dbStaff.emergency_contact as any || {
      name: '',
      phone: '',
      relationship: ''
    },
    bankInfo: dbStaff.bank_info as any || {}
  };
};

// Map app staff member to database format
export const mapStaffMemberToDatabase = (
  staff: Omit<StaffMember, 'id'>
): Omit<DatabaseStaffMember, 'id'> => {
  // Map app status to database format
  let dbStatus: DatabaseStaffMember['status'] = 'active';
  let employmentStatus: DatabaseStaffMember['employment_status'] = 'full_time';
  
  if (staff.status === 'on_break') {
    dbStatus = 'on_break';
  } else if (staff.status === 'off_duty') {
    dbStatus = 'off_duty';
  } else if (staff.status === 'terminated') {
    employmentStatus = 'terminated';
    dbStatus = 'active'; // Default to active since database doesn't have terminated status
  }
  
  return {
    name: staff.name,
    role: staff.role,
    email: staff.email,
    phone: staff.phone,
    address: staff.address,
    department: staff.department,
    certifications: staff.certifications,
    performance_rating: staff.performanceRating,
    status: dbStatus,
    notes: staff.notes,
    schedule: staff.schedule as Json,
    salary: staff.salary,
    hourly_rate: staff.hourlyRate,
    overtime_rate: staff.overtimeRate,
    shift: staff.shift,
    emergency_contact: staff.emergencyContact as Json,
    bank_info: staff.bankInfo as Json,
    employment_status: employmentStatus,
    hire_date: staff.hireDate,
    updated_at: new Date().toISOString()
  };
};
