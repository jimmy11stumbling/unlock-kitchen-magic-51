
import type { StaffMember } from "@/types/staff";
import type { DatabaseStaffMember } from "../types/databaseTypes";
import type { Json } from "@/integrations/supabase/types";

const parseJsonField = <T>(json: Json | null): T => {
  if (!json) return {} as T;
  if (typeof json === 'string') {
    try {
      return JSON.parse(json) as T;
    } catch {
      return {} as T;
    }
  }
  return json as T;
};

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

  const bankInfo = parseJsonField<{
    accountNumber?: string;
    routingNumber?: string;
    accountType?: "checking" | "savings";
  }>(dbStaff.bank_info);

  const emergencyContact = parseJsonField<{
    name?: string;
    phone?: string;
    relationship?: string;
  }>(dbStaff.emergency_contact);

  return {
    id: dbStaff.id,
    name: dbStaff.name,
    role: dbStaff.role,
    status: dbStaff.status,
    shift: dbStaff.shift || '',
    salary: dbStaff.salary || 0,
    email: dbStaff.email || '',
    phone: dbStaff.phone || '',
    address: dbStaff.address || '',
    emergencyContact: {
      name: emergencyContact.name || '',
      phone: emergencyContact.phone || '',
      relationship: emergencyContact.relationship || ''
    },
    startDate: dbStaff.created_at || new Date().toISOString(),
    department: dbStaff.department || '',
    certifications: dbStaff.certifications || [],
    performanceRating: dbStaff.performance_rating || 0,
    notes: dbStaff.notes || '',
    schedule: schedule,
    bankInfo: {
      accountNumber: bankInfo.accountNumber || '',
      routingNumber: bankInfo.routingNumber || '',
      accountType: bankInfo.accountType || 'checking'
    }
  };
};
