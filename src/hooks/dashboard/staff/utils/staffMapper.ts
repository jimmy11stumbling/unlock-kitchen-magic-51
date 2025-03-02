
import type { StaffMember } from "@/types/staff";
import type { DatabaseStaffMember } from "../types/databaseTypes";

// Define the function once, removing the duplicate declaration
export const mapDatabaseToStaffMember = (dbStaff: DatabaseStaffMember): StaffMember => {
  // Create a schedule object based on the database format
  const schedule: Record<string, string> = {};

  if (dbStaff.schedule) {
    if (typeof dbStaff.schedule === 'object') {
      const scheduleObj = dbStaff.schedule as Record<string, any>;
      
      // Map each day from the schedule
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      days.forEach(day => {
        schedule[day] = scheduleObj[day] ? String(scheduleObj[day]) : 'OFF';
      });
    }
  }

  // Map emergency contact
  const emergencyContact = dbStaff.emergency_contact ? {
    name: (dbStaff.emergency_contact as any).name || '',
    phone: (dbStaff.emergency_contact as any).phone || '',
    relationship: (dbStaff.emergency_contact as any).relationship || '',
  } : undefined;

  return {
    id: dbStaff.id,
    name: dbStaff.name,
    role: dbStaff.role,
    email: dbStaff.email,
    phone: dbStaff.phone,
    address: dbStaff.address,
    department: dbStaff.department,
    schedule,
    hourlyRate: dbStaff.hourly_rate,
    overtimeRate: dbStaff.overtime_rate,
    salary: dbStaff.salary,
    status: dbStaff.status,
    certifications: dbStaff.certifications || [],
    performanceRating: dbStaff.performance_rating || 0,
    notes: dbStaff.notes,
    emergencyContact,
    shift: dbStaff.shift,
    hireDate: dbStaff.hire_date || new Date().toISOString().split('T')[0],
    startDate: dbStaff.hire_date || new Date().toISOString().split('T')[0], // For backward compatibility
    bankInfo: dbStaff.bank_info
  };
};

export const mapStaffMemberToDatabase = (staff: Partial<StaffMember>): Omit<DatabaseStaffMember, "id"> => {
  return {
    name: staff.name,
    role: staff.role,
    email: staff.email,
    phone: staff.phone,
    address: staff.address,
    department: staff.department,
    schedule: staff.schedule,
    hourly_rate: staff.hourlyRate,
    overtime_rate: staff.overtimeRate,
    salary: staff.salary,
    status: staff.status,
    certifications: staff.certifications,
    performance_rating: staff.performanceRating,
    notes: staff.notes,
    emergency_contact: staff.emergencyContact,
    shift: staff.shift,
    bank_info: staff.bankInfo,
    hire_date: staff.hireDate || staff.startDate,
    employment_status: 'full_time', // Default value
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};
