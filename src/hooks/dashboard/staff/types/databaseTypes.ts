
import type { StaffRole } from "@/types/staff";

export interface DatabaseStaffMember {
  id: number;
  name: string;
  role: StaffRole;
  email: string | null;
  phone: string | null;
  status: 'active' | 'on_break' | 'off_duty';
  salary: number | null;
  shift: string | null;
  department: string | null;
  certifications: string[] | null;
  performance_rating: number | null;
  notes: string | null;
  schedule: Record<string, string> | string;
  bank_info: Record<string, any> | null;
  created_at: string | null;
  updated_at: string | null;
}
