import { supabase } from "@/integrations/supabase/client";
import type { StaffMember, StaffStatus } from "@/types/staff";

export const addStaffMember = async (data: Omit<StaffMember, "id">): Promise<StaffMember> => {
  try {
    // Mock implementation - in a real application, this would use Supabase
    return {
      ...data,
      id: Math.floor(Math.random() * 1000),
      status: "active"
    } as StaffMember;
  } catch (error) {
    console.error("Error adding staff member:", error);
    throw error;
  }
};

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
