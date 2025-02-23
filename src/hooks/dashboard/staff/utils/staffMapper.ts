
import type { StaffMember } from "@/types/staff";
import type { DatabaseStaffMember } from "../types/databaseTypes";

export const mapDatabaseToStaffMember = (dbStaff: DatabaseStaffMember): StaffMember => {
  // Ensure schedule is properly parsed and has the correct structure
  let schedule: StaffMember["schedule"];
  
  try {
    const defaultSchedule = {
      monday: "OFF",
      tuesday: "OFF",
      wednesday: "OFF",
      thursday: "OFF",
      friday: "OFF",
      saturday: "OFF",
      sunday: "OFF"
    };

    if (typeof dbStaff.schedule === 'string') {
      schedule = { ...defaultSchedule, ...JSON.parse(dbStaff.schedule) };
    } else if (typeof dbStaff.schedule === 'object') {
      schedule = { ...defaultSchedule, ...dbStaff.schedule };
    } else {
      schedule = defaultSchedule;
    }
  } catch (error) {
    console.error('Error parsing schedule:', error);
    schedule = {
      monday: "OFF",
      tuesday: "OFF",
      wednesday: "OFF",
      thursday: "OFF",
      friday: "OFF",
      saturday: "OFF",
      sunday: "OFF"
    };
  }

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
    schedule: schedule,
    bankInfo: {
      accountNumber: dbStaff.bank_info?.accountNumber || '',
      routingNumber: dbStaff.bank_info?.routingNumber || '',
      accountType: dbStaff.bank_info?.accountType || 'checking'
    }
  };
};
