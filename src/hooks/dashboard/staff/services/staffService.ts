
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";
import type { DatabaseStaffMember } from "../types/databaseTypes";

export const fetchStaffMembers = async () => {
  const { data, error } = await supabase
    .from('staff_members')
    .select('*');

  if (error) throw error;
  return data as DatabaseStaffMember[];
};

export const createStaffMember = async (data: Omit<StaffMember, "id" | "status">) => {
  const { data: newStaff, error } = await supabase
    .from('staff_members')
    .insert({
      name: data.name,
      role: data.role,
      email: data.email,
      phone: data.phone,
      salary: data.salary,
      department: data.department,
      certifications: data.certifications,
      schedule: data.schedule,
      bank_info: data.bankInfo
    })
    .select()
    .single();

  if (error) throw error;
  return newStaff as DatabaseStaffMember;
};

export const updateStaffMemberStatus = async (staffId: number, newStatus: StaffMember["status"]) => {
  const { error } = await supabase
    .from('staff_members')
    .update({ status: newStatus })
    .eq('id', staffId);

  if (error) throw error;
};

export const updateStaffMemberInfo = async (staffId: number, updates: Partial<DatabaseStaffMember>) => {
  const { error } = await supabase
    .from('staff_members')
    .update(updates)
    .eq('id', staffId);

  if (error) throw error;
};
