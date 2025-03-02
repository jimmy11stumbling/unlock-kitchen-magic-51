import type { StaffMember, StaffRole, StaffStatus } from "@/types/staff";
import type { DatabaseStaffMember } from '../types/databaseTypes';
import { Json } from "@/types/database";

export const mapDatabaseStaffToClient = (dbStaff: DatabaseStaffMember): StaffMember => {
  // Extract emergency contact from JSON
  const emergencyContact = dbStaff.emergency_contact ? 
    typeof dbStaff.emergency_contact === 'string' 
      ? JSON.parse(dbStaff.emergency_contact)
      : dbStaff.emergency_contact
    : undefined;

  // Extract schedule from JSON
  const scheduleData = dbStaff.schedule ? 
    typeof dbStaff.schedule === 'string' 
      ? JSON.parse(dbStaff.schedule)
      : dbStaff.schedule
    : undefined;

  // Convert snake_case schedule to object
  const schedule: Record<string, string> = {};
  if (scheduleData && typeof scheduleData === 'object') {
    if (Array.isArray(scheduleData)) {
      // Handle array format if it exists
      scheduleData.forEach((item: any) => {
        if (item.day && item.hours) {
          schedule[item.day.toLowerCase()] = item.hours;
        }
      });
    } else {
      // Handle object format
      Object.keys(scheduleData).forEach(key => {
        schedule[key.replace('_', '')] = String(scheduleData[key]);
      });
    }
  }

  return {
    id: dbStaff.id,
    name: dbStaff.name,
    role: dbStaff.role,
    status: dbStaff.status,
    email: dbStaff.email || '',
    phone: dbStaff.phone || '',
    address: dbStaff.address || '',
    department: dbStaff.department || '',
    shift: dbStaff.shift || '',
    hireDate: dbStaff.hire_date || new Date().toISOString().split('T')[0], // Supply a default date
    hourlyRate: dbStaff.hourly_rate || 0,
    overtimeRate: dbStaff.overtime_rate || 0,
    salary: dbStaff.salary || 0,
    schedule,
    emergencyContact: emergencyContact,
    certifications: dbStaff.certifications ? 
      Array.isArray(dbStaff.certifications) ? 
        dbStaff.certifications : 
        [] 
      : [],
    performanceRating: dbStaff.performance_rating || 0,
    notes: dbStaff.notes || '',
    startDate: dbStaff.start_date || '',
    bankInfo: dbStaff.bank_info || null
  };
};

export const mapClientStaffToDatabase = (clientStaff: Omit<StaffMember, 'id'>): Omit<DatabaseStaffMember, 'id'> => {
  const scheduleString = JSON.stringify(clientStaff.schedule);
  const emergencyContactString = JSON.stringify(clientStaff.emergencyContact);

  return {
    name: clientStaff.name,
    role: clientStaff.role,
    status: clientStaff.status,
    email: clientStaff.email || null,
    phone: clientStaff.phone || null,
    address: clientStaff.address || null,
    department: clientStaff.department || null,
    shift: clientStaff.shift || null,
    hire_date: clientStaff.hireDate || new Date().toISOString().split('T')[0],
    hourly_rate: clientStaff.hourlyRate || null,
    overtime_rate: clientStaff.overtimeRate || null,
    salary: clientStaff.salary || null,
    schedule: scheduleString as Json,
    emergency_contact: emergencyContactString as Json,
    certifications: clientStaff.certifications || [],
    performance_rating: clientStaff.performanceRating || null,
    notes: clientStaff.notes || null,
    start_date: clientStaff.startDate || null,
    bank_info: clientStaff.bankInfo || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tax_id: null,
    benefits: null,
    employment_status: "full_time",
  };
};
