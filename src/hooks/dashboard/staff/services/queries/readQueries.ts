
import { supabase } from "@/integrations/supabase/client";
import { checkTableExists } from "../utils/supabaseUtils";
import { mockStaffData } from "../mockData/mockStaffData";
import type { DatabaseStaffMember } from "../../types/databaseTypes";

export const fetchStaffMembers = async (): Promise<DatabaseStaffMember[]> => {
  try {
    const tableExists = await checkTableExists();

    if (!tableExists) {
      console.warn('Staff members table does not exist, using mock data');
      return mockStaffData;
    }

    const { data: staffData, error: fetchError } = await supabase
      .from('staff_members')
      .select('*')
      .order('id', { ascending: true });

    if (fetchError) {
      console.error('Error fetching staff:', fetchError);
      throw fetchError;
    }

    return staffData || [];
  } catch (error) {
    console.error('Error in fetchStaffMembers:', error);
    return mockStaffData;
  }
};

export const getStaffPermissions = async (staffId: number): Promise<string[]> => {
  try {
    const tableExists = await checkTableExists();

    if (!tableExists) {
      const staff = mockStaffData.find(s => s.id === staffId);
      return staff?.role === 'manager' ? ['all'] : ['basic'];
    }

    const { data: staff, error } = await supabase
      .from('staff_members')
      .select('role')
      .eq('id', staffId)
      .single();

    if (error) throw error;
    if (!staff) return ['basic'];

    return staff.role === 'manager' ? ['all'] : ['basic'];
  } catch (error) {
    console.error('Error fetching staff permissions:', error);
    return ['basic'];
  }
};
