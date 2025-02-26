import { supabase } from "@/integrations/supabase/client";
import type { DatabaseStaffMember } from "../../types/databaseTypes";
import type { StaffRole } from "@/types/staff";

export const updateStaffMember = async (staffId: number, data: Partial<DatabaseStaffMember>) => {
  try {
    const { error } = await supabase
      .from('staff_members')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
        employment_status: data.employment_status as "full_time" | "part_time" | "contract" | "terminated"
      })
      .eq('id', staffId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating staff member:', error);
    throw error;
  }
};
