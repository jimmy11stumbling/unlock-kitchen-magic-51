
import { supabase } from "@/integrations/supabase/client";
import { checkTableExists } from "../utils/supabaseUtils";
import { mockStaffData } from "../mockData/mockStaffData";
import type { DatabaseStaffMember } from "../../types/databaseTypes";

export const searchStaffMembers = async (query: string): Promise<DatabaseStaffMember[]> => {
  try {
    const tableExists = await checkTableExists();

    if (!tableExists) {
      return mockStaffData.filter(staff => 
        staff.name.toLowerCase().includes(query.toLowerCase()) ||
        staff.email.toLowerCase().includes(query.toLowerCase()) ||
        staff.department.toLowerCase().includes(query.toLowerCase())
      );
    }

    const { data: staffData, error } = await supabase
      .from('staff_members')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,department.ilike.%${query}%`)
      .order('name', { ascending: true });

    if (error) throw error;
    return staffData || [];
  } catch (error) {
    console.error('Error searching staff members:', error);
    return [];
  }
};

export const getStaffByDepartment = async (department: string): Promise<DatabaseStaffMember[]> => {
  try {
    const tableExists = await checkTableExists();

    if (!tableExists) {
      return mockStaffData.filter(staff => staff.department === department);
    }

    const { data: staffData, error } = await supabase
      .from('staff_members')
      .select('*')
      .eq('department', department)
      .order('name', { ascending: true });

    if (error) throw error;
    return staffData || [];
  } catch (error) {
    console.error('Error fetching staff by department:', error);
    return [];
  }
};
