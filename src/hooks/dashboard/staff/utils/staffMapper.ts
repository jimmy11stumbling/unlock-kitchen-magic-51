
import type { StaffMember } from '@/types/staff/employee';
import type { DatabaseStaffMember, DatabaseStaffMemberInsert } from '../types/databaseTypes';
import { mapDatabaseToStaffStatus, mapStaffStatusToDatabase } from '../types/databaseTypes';

export const mapDatabaseToStaffMember = (dbStaff: DatabaseStaffMember): StaffMember => {
  return {
    id: dbStaff.id,
    name: dbStaff.name,
    email: dbStaff.email,
    phone: dbStaff.phone,
    role: dbStaff.role,
    department: dbStaff.department,
    status: mapDatabaseToStaffStatus(dbStaff.status as any) || 'active',
    salary: dbStaff.salary,
    hourlyRate: dbStaff.hourly_rate,
    overtimeRate: dbStaff.overtime_rate,
    performanceRating: dbStaff.performance_rating,
    schedule: dbStaff.schedule as Record<string, string>,
    certifications: dbStaff.certifications,
    notes: dbStaff.notes,
    address: dbStaff.address,
    emergencyContact: dbStaff.emergency_contact as any,
    bankInfo: dbStaff.bank_info,
    // Handle hire_date - it's not in the database type
    hireDate: (dbStaff as any).hire_date || new Date().toISOString().split('T')[0],
    startDate: (dbStaff as any).hire_date || new Date().toISOString().split('T')[0],
    shift: dbStaff.shift,
  };
};

export const mapStaffMemberToDatabase = (staff: Partial<StaffMember>): DatabaseStaffMemberInsert => {
  const result: any = {
    name: staff.name || '',
    email: staff.email,
    phone: staff.phone,
    role: staff.role || 'server',
    department: staff.department,
    status: staff.status ? mapStaffStatusToDatabase(staff.status) : 'active',
    salary: staff.salary,
    hourly_rate: staff.hourlyRate,
    overtime_rate: staff.overtimeRate,
    performance_rating: staff.performanceRating,
    schedule: staff.schedule,
    certifications: staff.certifications,
    notes: staff.notes,
    address: staff.address,
    emergency_contact: staff.emergencyContact,
    bank_info: staff.bankInfo,
    shift: staff.shift,
    // Handle hire_date specially
    hire_date: staff.hireDate,
    updated_at: new Date().toISOString(),
  };

  return result;
};
