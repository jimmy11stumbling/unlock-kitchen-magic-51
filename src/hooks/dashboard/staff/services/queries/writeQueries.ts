
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember, StaffStatus } from "@/types/staff";
import type { Json } from "@/integrations/supabase/types";
import { staffMappers } from "../../utils/staffMapper";

export const createStaffMember = async (staffMember: Omit<StaffMember, "id">): Promise<StaffMember> => {
  try {
    const dbStaff = staffMappers.mapStaffMemberToDatabase(staffMember);
    
    const { data, error } = await supabase
      .from('staff_members')
      .insert(dbStaff)
      .select()
      .single();

    if (error) throw error;
    return staffMappers.mapDatabaseToStaffMember(data);
  } catch (error) {
    console.error('Error creating staff member:', error);
    throw error;
  }
};

export const updateStaffStatus = async (staffId: number, status: StaffStatus): Promise<StaffMember> => {
  try {
    const dbStatus = staffMappers.mapStaffMemberToDatabase({ status }).status;
    
    const { data, error } = await supabase
      .from('staff_members')
      .update({ status: dbStatus, updated_at: new Date().toISOString() })
      .eq('id', staffId)
      .select()
      .single();

    if (error) throw error;
    return staffMappers.mapDatabaseToStaffMember(data);
  } catch (error) {
    console.error('Error updating staff status:', error);
    throw error;
  }
};

export const updateStaffInfo = async (staffId: number, updates: Partial<StaffMember>): Promise<StaffMember> => {
  try {
    const dbUpdates = staffMappers.mapStaffMemberToDatabase(updates);
    dbUpdates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('staff_members')
      .update(dbUpdates)
      .eq('id', staffId)
      .select()
      .single();

    if (error) throw error;
    return staffMappers.mapDatabaseToStaffMember(data);
  } catch (error) {
    console.error('Error updating staff info:', error);
    throw error;
  }
};

// Helper function to check if a table exists
const tableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    return !error;
  } catch (error) {
    return false;
  }
};
