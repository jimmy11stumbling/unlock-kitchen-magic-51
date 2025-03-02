import { supabase } from "@/integrations/supabase/client";
import type { StaffMember, StaffStatus } from "@/types/staff";

export const addStaffMember = async (staffData: Omit<StaffMember, "id" | "status">) => {
  try {
    const newStaff = {
      id: Math.floor(Math.random() * 1000) + 100,
      status: 'active',
      ...staffData
    };
    
    console.log('Added new staff member:', newStaff);
    return newStaff as StaffMember;
  } catch (error) {
    console.error('Error adding staff member:', error);
    throw error;
  }
};

export const updateStaffInfo = async (staffId: number, updates: Partial<StaffMember>) => {
  try {
    console.log(`Updated staff ${staffId} with:`, updates);
    return {
      id: staffId,
      name: 'Mock Staff',
      role: 'server' as const,
      email: 'mock@example.com',
      phone: '555-1234',
      status: 'active' as const,
      salary: 35000,
      hireDate: '2023-01-01',
      ...updates
    } as StaffMember;
  } catch (error) {
    console.error('Error updating staff member:', error);
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
