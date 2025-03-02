
import { supabase } from "@/integrations/supabase/client";
import { staffMappers } from "../../utils/staffMapper";
import type { StaffMember } from "@/types/staff";

export const readQueries = {
  getAllStaffMembers: async (): Promise<StaffMember[]> => {
    try {
      const { data, error } = await supabase
        .from('staff_members')
        .select('*');

      if (error) throw error;

      if (data) {
        return data.map(staffMappers.mapDatabaseToStaffMember);
      }
      return [];
    } catch (error) {
      console.error('Error fetching staff members:', error);
      throw error;
    }
  },

  getStaffMemberById: async (id: number): Promise<StaffMember | null> => {
    try {
      const { data, error } = await supabase
        .from('staff_members')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        return staffMappers.mapDatabaseToStaffMember(data);
      }
      return null;
    } catch (error) {
      console.error('Error fetching staff member:', error);
      throw error;
    }
  }
};
