
import type { StaffRole, StaffStatus } from "@/types/employee/base";

export interface DatabaseStaffMember {
  id: number;
  name: string;
  role: StaffRole;
  email: string | null;
  phone: string | null;
  status: StaffStatus;
  salary: number | null;
  shift: string | null;
  department: string | null;
  certifications: string[] | null;
  performance_rating: number | null;
  notes: string | null;
  schedule: Record<string, string> | string;
  bank_info: {
    accountNumber?: string;
    routingNumber?: string;
    accountType?: "checking" | "savings";
  } | null;
  created_at: string | null;
  updated_at: string | null;
}
