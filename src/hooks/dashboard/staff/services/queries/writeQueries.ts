import { supabase } from "@/integrations/supabase/client";
import type { StaffMember, StaffStatus } from "@/types/staff";
import { staffMappers } from "../../utils/staffMapper";

export const updateStaffStatus = async (staffId: number, status: StaffStatus): Promise<StaffMember | null> => {
  try {
    const { data, error } = await supabase
      .from('staff')
      .update({ status })
      .eq('id', staffId)
      .select()
      .single();

    if (error) {
      console.error("Error updating staff status:", error);
      return null;
    }

    return data as StaffMember;
  } catch (error) {
    console.error("Error updating staff status:", error);
    return null;
  }
};
