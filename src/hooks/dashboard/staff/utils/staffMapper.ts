import type { StaffMember } from '@/types/staff';
import type { Json } from '@/types/database';
import type { DatabaseStaffMember } from '../types/databaseTypes';

export const mapDatabaseToStaffMember = (dbStaff: DatabaseStaffMember): StaffMember => {
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

  // Update to handle missing hire_date and start_date properties
  let hireDate = undefined;
  if ('hire_date' in dbStaff && dbStaff.hire_date) {
    hireDate = dbStaff.hire_date;
  } else if ('created_at' in dbStaff && dbStaff.created_at) {
    hireDate = dbStaff.created_at;
  }

  let startDate = undefined;
  if ('start_date' in dbStaff && dbStaff.start_date) {
    startDate = dbStaff.start_date;
  } else if ('created_at' in dbStaff && dbStaff.created_at) {
    startDate = dbStaff.created_at;
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
    hireDate: hireDate || new Date().toISOString().split('T')[0], // Supply a default date
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
    startDate: startDate || '',
    bankInfo: dbStaff.bank_info || null
  };
};

export const mapStaffMemberToDatabase = (staff: Partial<StaffMember>): Omit<DatabaseStaffMember, "id"> => {
  const scheduleString = JSON.stringify(staff.schedule);
  const emergencyContactString = JSON.stringify(staff.emergencyContact);

  return {
    name: staff.name,
    role: staff.role,
    status: staff.status,
    email: staff.email || null,
    phone: staff.phone || null,
    address: staff.address || null,
    department: staff.department || null,
    shift: staff.shift || null,
    hire_date: staff.hireDate || new Date().toISOString().split('T')[0],
    hourly_rate: staff.hourlyRate || null,
    overtime_rate: staff.overtimeRate || null,
    salary: staff.salary || null,
    schedule: scheduleString as Json,
    emergency_contact: emergencyContactString as Json,
    certifications: staff.certifications || [],
    performance_rating: staff.performanceRating || null,
    notes: staff.notes || null,
    start_date: staff.startDate || null,
    bank_info: staff.bankInfo || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tax_id: null,
    benefits: null,
    employment_status: "full_time",
  };
};

// Export this function that is referenced in other files
export { mapDatabaseToStaffMember as mapDatabaseToStaffMember };
