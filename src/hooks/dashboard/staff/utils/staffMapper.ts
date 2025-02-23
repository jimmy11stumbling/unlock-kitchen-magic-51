
import type { StaffMember } from "@/types/staff";
import type { DatabaseStaffMember } from "../types/databaseTypes";

export const mapDatabaseToStaffMember = (dbStaff: DatabaseStaffMember): StaffMember => {
  let schedule = typeof dbStaff.schedule === 'string' 
    ? JSON.parse(dbStaff.schedule)
    : dbStaff.schedule || {};

  return {
    id: dbStaff.id,
    name: dbStaff.name,
    role: dbStaff.role,
    status: dbStaff.status,
    shift: dbStaff.shift || '',
    salary: dbStaff.salary || 0,
    email: dbStaff.email || '',
    phone: dbStaff.phone || '',
    address: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    startDate: dbStaff.created_at || new Date().toISOString(),
    department: dbStaff.department || '',
    certifications: dbStaff.certifications || [],
    performanceRating: dbStaff.performance_rating || 0,
    notes: dbStaff.notes || '',
    schedule: {
      monday: schedule.monday || 'OFF',
      tuesday: schedule.tuesday || 'OFF',
      wednesday: schedule.wednesday || 'OFF',
      thursday: schedule.thursday || 'OFF',
      friday: schedule.friday || 'OFF',
      saturday: schedule.saturday || 'OFF',
      sunday: schedule.sunday || 'OFF'
    },
    bankInfo: {
      accountNumber: dbStaff.bank_info?.accountNumber || '',
      routingNumber: dbStaff.bank_info?.routingNumber || '',
      accountType: dbStaff.bank_info?.accountType || 'checking'
    }
  };
};
