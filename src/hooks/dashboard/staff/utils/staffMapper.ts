
import type { StaffMember, StaffStatus } from "@/types/staff";
import type { Json } from "@/integrations/supabase/types";

// Helper to convert Json to strongly typed object safely
const safeJsonParse = <T>(json: Json | null, defaultValue: T): T => {
  if (!json) return defaultValue;
  if (typeof json === 'object') return json as unknown as T;
  try {
    return JSON.parse(json as string) as T;
  } catch (e) {
    return defaultValue;
  }
};

// Map between application status and database status
const mapStatusToDatabase = (status: StaffStatus): "active" | "on_break" | "off_duty" => {
  switch (status) {
    case "active":
    case "on_duty":
      return "active";
    case "on_break":
      return "on_break";
    case "off_duty":
    case "on_leave":
    case "terminated":
      return "off_duty";
    default:
      return "active";
  }
};

const mapDatabaseToStatus = (dbStatus: string): StaffStatus => {
  switch (dbStatus) {
    case "active":
      return "active";
    case "on_break":
      return "on_break";
    case "off_duty":
      return "off_duty";
    default:
      return "active";
  }
};

export const staffMappers = {
  mapDatabaseToStaffMember: (dbStaff: any): StaffMember => {
    return {
      id: dbStaff.id,
      name: dbStaff.name,
      email: dbStaff.email,
      phone: dbStaff.phone,
      role: dbStaff.role,
      status: mapDatabaseToStatus(dbStaff.status),
      department: dbStaff.department,
      hireDate: dbStaff.hire_date,
      schedule: safeJsonParse(dbStaff.schedule, {}),
      salary: dbStaff.salary,
      performanceRating: dbStaff.performance_rating || 0,
      certifications: dbStaff.certifications || [],
      notes: dbStaff.notes,
      emergencyContact: safeJsonParse(dbStaff.emergency_contact, { name: "", phone: "", relationship: "" }),
      shift: dbStaff.shift,
    };
  },

  mapStaffMemberToDatabase: (staff: Partial<StaffMember>): any => {
    const dbStaff: any = {};
    
    if (staff.name !== undefined) dbStaff.name = staff.name;
    if (staff.email !== undefined) dbStaff.email = staff.email;
    if (staff.phone !== undefined) dbStaff.phone = staff.phone;
    if (staff.role !== undefined) dbStaff.role = staff.role;
    if (staff.status !== undefined) dbStaff.status = mapStatusToDatabase(staff.status);
    if (staff.department !== undefined) dbStaff.department = staff.department;
    if (staff.hireDate !== undefined) dbStaff.hire_date = staff.hireDate;
    if (staff.schedule !== undefined) dbStaff.schedule = staff.schedule;
    if (staff.salary !== undefined) dbStaff.salary = staff.salary;
    if (staff.performanceRating !== undefined) dbStaff.performance_rating = staff.performanceRating;
    if (staff.certifications !== undefined) dbStaff.certifications = staff.certifications;
    if (staff.notes !== undefined) dbStaff.notes = staff.notes;
    if (staff.emergencyContact !== undefined) dbStaff.emergency_contact = staff.emergencyContact;
    if (staff.shift !== undefined) dbStaff.shift = staff.shift;
    
    return dbStaff;
  }
};
