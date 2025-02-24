
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";
import type { DatabaseStaffMember, DatabaseStaffMemberInsert } from "../types/databaseTypes";

const createStaffMembersTable = async () => {
  try {
    await supabase.from('staff_members').select('*').limit(1);
  } catch (error) {
    console.error('Error in createStaffMembersTable:', error);
  }
};

export const fetchStaffMembers = async () => {
  try {
    await createStaffMembersTable();

    const { data: staffData, error: fetchError } = await supabase
      .from('staff_members')
      .select('*')
      .order('id', { ascending: true });

    if (fetchError) {
      console.error('Error fetching staff:', fetchError);
      return [];
    }

    if (!staffData) return [];

    return staffData;
  } catch (error) {
    console.error('Error in fetchStaffMembers:', error);
    return [];
  }
};

export const createStaffMember = async (data: Omit<StaffMember, "id" | "status">) => {
  try {
    const staffData: DatabaseStaffMemberInsert = {
      name: data.name,
      role: data.role,
      email: data.email || '',
      phone: data.phone || '',
      status: 'active',
      salary: data.salary || 0,
      department: data.department || '',
      certifications: data.certifications || [],
      performance_rating: 0,
      shift: data.shift || 'day',
      address: data.address || '',
      schedule: data.schedule,
      bank_info: {
        accountNumber: data.bankInfo?.accountNumber || '',
        routingNumber: data.bankInfo?.routingNumber || '',
        accountType: data.bankInfo?.accountType || 'checking'
      },
      emergency_contact: {
        name: data.emergencyContact?.name || '',
        phone: data.emergencyContact?.phone || '',
        relationship: data.emergencyContact?.relationship || ''
      },
      notes: '',
      employment_status: 'full_time',
      hire_date: new Date().toISOString(),
      benefits: {},
      hourly_rate: 0,
      overtime_rate: 0
    };

    const { data: newStaff, error } = await supabase
      .from('staff_members')
      .insert([staffData])
      .select()
      .single();

    if (error) {
      console.error('Error creating staff member:', error);
      throw error;
    }

    if (!newStaff) {
      throw new Error('No staff member returned from creation');
    }

    return newStaff;
  } catch (error) {
    console.error('Error in createStaffMember:', error);
    throw error;
  }
};

export const updateStaffMemberStatus = async (staffId: number, newStatus: StaffMember["status"]) => {
  const { error } = await supabase
    .from('staff_members')
    .update({ status: newStatus })
    .eq('id', staffId);

  if (error) {
    console.error('Error updating staff status:', error);
    throw error;
  }
};

export const updateStaffMemberInfo = async (staffId: number, updates: Partial<DatabaseStaffMember>) => {
  const { error } = await supabase
    .from('staff_members')
    .update(updates)
    .eq('id', staffId);

  if (error) {
    console.error('Error updating staff info:', error);
    throw error;
  }
};
