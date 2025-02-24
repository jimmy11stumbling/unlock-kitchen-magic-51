import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";
import type { DatabaseStaffMember } from "../types/databaseTypes";

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

    return staffData.map(staff => ({
      id: staff.id,
      name: staff.name,
      role: staff.role,
      email: staff.email || '',
      phone: staff.phone || '',
      status: staff.status,
      salary: staff.salary || 0,
      shift: staff.shift || 'day',
      department: staff.department || '',
      certifications: staff.certifications || [],
      performance_rating: staff.performance_rating || 0,
      bankInfo: {
        accountNumber: (staff.bank_info as any)?.accountNumber || '',
        routingNumber: (staff.bank_info as any)?.routingNumber || '',
        accountType: (staff.bank_info as any)?.accountType || 'checking'
      },
      emergencyContact: {
        name: (staff.emergency_contact as any)?.name || '',
        phone: (staff.emergency_contact as any)?.phone || '',
        relationship: (staff.emergency_contact as any)?.relationship || ''
      },
      notes: staff.notes || '',
      created_at: staff.created_at,
      updated_at: staff.updated_at
    }));
  } catch (error) {
    console.error('Error in fetchStaffMembers:', error);
    return [];
  }
};

export const createStaffMember = async (data: Omit<StaffMember, "id" | "status">) => {
  try {
    const staffData = {
      name: data.name,
      role: data.role,
      email: data.email || '',
      phone: data.phone || '',
      status: 'active' as const,
      salary: data.salary || 0,
      department: data.department || '',
      certifications: data.certifications || [],
      schedule: data.schedule || {
        monday: "OFF",
        tuesday: "OFF",
        wednesday: "OFF",
        thursday: "OFF",
        friday: "OFF",
        saturday: "OFF",
        sunday: "OFF"
      },
      bank_info: {
        accountNumber: data.bankInfo?.accountNumber || '',
        routingNumber: data.bankInfo?.routingNumber || '',
        accountType: data.bankInfo?.accountType || 'checking'
      },
      performance_rating: 0,
      shift: data.shift || 'day',
      address: data.address || '',
      emergency_contact: {
        name: data.emergencyContact?.name || '',
        phone: data.emergencyContact?.phone || '',
        relationship: data.emergencyContact?.relationship || ''
      },
      notes: ''
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

    const transformedStaff: DatabaseStaffMember = {
      id: newStaff.id,
      name: newStaff.name,
      role: newStaff.role,
      email: newStaff.email || '',
      phone: newStaff.phone || '',
      status: newStaff.status as StaffMember['status'],
      salary: newStaff.salary || 0,
      shift: newStaff.shift || 'day',
      department: newStaff.department || '',
      certifications: newStaff.certifications || [],
      performance_rating: newStaff.performance_rating || 0,
      address: newStaff.address || '',
      schedule: newStaff.schedule as Record<string, string>,
      bank_info: {
        accountNumber: (newStaff.bank_info as any)?.accountNumber || '',
        routingNumber: (newStaff.bank_info as any)?.routingNumber || '',
        accountType: (newStaff.bank_info as any)?.accountType || 'checking'
      },
      emergency_contact: {
        name: (newStaff.emergency_contact as any)?.name || '',
        phone: (newStaff.emergency_contact as any)?.phone || '',
        relationship: (newStaff.emergency_contact as any)?.relationship || ''
      },
      notes: newStaff.notes || '',
      created_at: newStaff.created_at,
      updated_at: newStaff.updated_at
    };

    return transformedStaff;
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
