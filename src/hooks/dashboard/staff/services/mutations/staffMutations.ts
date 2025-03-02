
import { supabase } from "@/integrations/supabase/client";
import type { DatabaseStaffMember } from "../../types/databaseTypes";
import type { StaffRole, StaffStatus } from "@/types/staff";

export const updateStaffMember = async (staffId: number, data: Partial<DatabaseStaffMember>) => {
  try {
    // Handle the status field specially to match expected database enum values
    let updateData = { ...data };
    
    // Ensure status is compatible with database enum
    if (updateData.status) {
      // Map any incompatible statuses to allowed ones
      const status = updateData.status as StaffStatus;
      if (status === 'terminated' || status === 'on_leave') {
        // Map to compatible status for database
        updateData.status = 'off_duty';
      }
    }
    
    const { error } = await supabase
      .from('staff_members')
      .update({
        ...updateData,
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
