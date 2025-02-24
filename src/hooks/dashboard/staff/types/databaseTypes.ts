
import type { Database } from "@/integrations/supabase/types";

export type DatabaseStaffMember = Database["public"]["Tables"]["staff_members"]["Row"] & {
  access_level?: 'admin' | 'staff';
};
export type DatabaseStaffMemberInsert = Database["public"]["Tables"]["staff_members"]["Insert"] & {
  access_level?: 'admin' | 'staff';
};
