
import type { Json } from '@/integrations/supabase/types';
import { StaffStatus, StaffRole } from './staffTypes';

export type DatabaseStaffStatus = "active" | "on_break" | "off_duty";

export interface DatabaseStaffMember {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  role: StaffRole;
  status?: DatabaseStaffStatus;
  department?: string;
  address?: string;
  salary?: number;
  hourly_rate?: number;
  overtime_rate?: number;
  performance_rating?: number;
  schedule?: Json;
  certifications?: string[];
  notes?: string;
  bank_info?: Json;
  emergency_contact?: Json;
  benefits?: Json;
  created_at?: string;
  updated_at?: string;
  employment_status?: "full_time" | "part_time" | "contract" | "terminated";
  shift?: string;
  tax_id?: string;
}

export type DatabaseStaffMemberInsert = Omit<DatabaseStaffMember, 'id'>;

// Utility function to map StaffStatus to DatabaseStaffStatus
export const mapStaffStatusToDatabase = (status: StaffStatus): DatabaseStaffStatus => {
  // Map terminated, on_leave to active or off_duty as they don't exist in the database
  if (status === 'terminated' || status === 'on_leave') {
    return 'off_duty';
  }
  if (status === 'on_duty') {
    return 'active';
  }
  return status as DatabaseStaffStatus;
};

export const mapDatabaseToStaffStatus = (status: DatabaseStaffStatus): StaffStatus => {
  if (status === 'active') {
    return 'active';
  }
  if (status === 'off_duty') {
    return 'off_duty';
  }
  if (status === 'on_break') {
    return 'on_break';
  }
  return 'active'; // Default
};
