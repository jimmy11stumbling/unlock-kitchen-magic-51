
import type { Json } from "@/integrations/supabase/types";
import type { StaffRole, StaffStatus } from "@/types/staff";

export type DatabaseStaffMember = {
  id: number;
  name: string;
  role: StaffRole;
  status: StaffStatus;
  email: string;
  phone: string;
  address?: string;
  department?: string;
  salary?: number;
  hourly_rate?: number;
  overtime_rate?: number;
  shift?: string;
  performance_rating: number;
  certifications?: string[];
  schedule?: Json;
  emergency_contact?: Json;
  bank_info?: Json;
  benefits?: Json;
  employment_status?: "full_time" | "part_time" | "contract" | "terminated";
  created_at?: string;
  updated_at?: string;
};
