
import type { Database } from "@/integrations/supabase/types";

export type DatabaseStaffMember = Database["public"]["Tables"]["staff_members"]["Row"];
export type DatabaseStaffMemberInsert = Database["public"]["Tables"]["staff_members"]["Insert"];
