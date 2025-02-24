
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";
import type { DatabaseStaffMember, DatabaseStaffMemberInsert } from "../types/databaseTypes";

const createStaffMembersTable = async () => {
  try {
    // Check if table exists
    const { data: existingTable, error: checkError } = await supabase
      .from('staff_members')
      .select('id')
      .limit(1);

    // If we can query the table, it exists
    if (!checkError) {
      return;
    }

    // Create table if it doesn't exist
    const { error: createError } = await supabase.schema.createTable('staff_members', {
      id: 'serial primary key',
      name: 'text',
      role: 'text',
      email: 'text',
      phone: 'text',
      status: 'text',
      salary: 'numeric',
      department: 'text',
      certifications: 'jsonb',
      performance_rating: 'numeric',
      shift: 'text',
      address: 'text',
      schedule: 'jsonb',
      bank_info: 'jsonb',
      emergency_contact: 'jsonb',
      notes: 'text',
      employment_status: 'text',
      hire_date: 'timestamptz',
      benefits: 'jsonb',
      hourly_rate: 'numeric',
      overtime_rate: 'numeric',
      created_at: 'timestamptz default now()',
      updated_at: 'timestamptz default now()'
    });

    if (createError) {
      console.error('Error creating staff table:', createError);
      throw createError;
    }
  } catch (error) {
    console.error('Error in createStaffMembersTable:', error);
    throw error;
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
      throw fetchError;
    }

    if (!staffData) return [];

    return staffData;
  } catch (error) {
    console.error('Error in fetchStaffMembers:', error);
    throw error;
  }
};

export const createStaffMember = async (data: Omit<StaffMember, "id" | "status">) => {
  try {
    await createStaffMembersTable();

    const staffData: DatabaseStaffMemberInsert = {
      name: data.name || '',
      role: data.role || 'server',
      email: data.email || '',
      phone: data.phone || '',
      status: 'active',
      salary: data.salary || 0,
      department: data.department || '',
      certifications: data.certifications || [],
      performance_rating: data.performanceRating || 0,
      shift: data.shift || 'day',
      address: data.address || '',
      schedule: typeof data.schedule === 'object' ? data.schedule : {
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
      emergency_contact: {
        name: data.emergencyContact?.name || '',
        phone: data.emergencyContact?.phone || '',
        relationship: data.emergencyContact?.relationship || ''
      },
      notes: data.notes || '',
      employment_status: 'full_time',
      hire_date: new Date().toISOString(),
      benefits: {},
      hourly_rate: data.hourlyRate || 0,
      overtime_rate: data.overtimeRate || 0
    };

    const { data: newStaff, error } = await supabase
      .from('staff_members')
      .insert([staffData])
      .select()
      .single();

    if (error) {
      console.error('Error creating staff member:', error);
      throw new Error(`Failed to create staff member: ${error.message}`);
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
  try {
    await createStaffMembersTable();

    const { error } = await supabase
      .from('staff_members')
      .update({ status: newStatus })
      .eq('id', staffId);

    if (error) {
      console.error('Error updating staff status:', error);
      throw new Error(`Failed to update staff status: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in updateStaffMemberStatus:', error);
    throw error;
  }
};

export const updateStaffMemberInfo = async (staffId: number, updates: Partial<DatabaseStaffMember>) => {
  try {
    await createStaffMembersTable();

    const { error } = await supabase
      .from('staff_members')
      .update(updates)
      .eq('id', staffId);

    if (error) {
      console.error('Error updating staff info:', error);
      throw new Error(`Failed to update staff info: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in updateStaffMemberInfo:', error);
    throw error;
  }
};
