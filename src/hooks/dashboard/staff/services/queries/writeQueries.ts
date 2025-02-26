import { supabase } from "@/integrations/supabase/client";
import { checkTableExists } from "../utils/supabaseUtils";
import { mockStaffData } from "../mockData/mockStaffData";
import type { StaffMember } from "@/types/staff";
import type { DatabaseStaffMember, DatabaseStaffMemberInsert } from "../../types/databaseTypes";

export const createStaffMember = async (data: Omit<StaffMember, "id" | "status">) => {
  try {
    const tableExists = await checkTableExists();

    if (!tableExists) {
      console.warn('Staff members table does not exist, using mock data');
      const newId = mockStaffData.length + 1;
      const newStaff: DatabaseStaffMember = {
        id: newId,
        name: data.name,
        role: data.role,
        email: data.email,
        phone: data.phone,
        status: 'active',
        salary: data.salary,
        department: data.department,
        certifications: data.certifications,
        performance_rating: data.performance_rating || 0,
        shift: data.shift,
        address: data.address,
        schedule: data.schedule,
        bank_info: data.bankInfo,
        emergency_contact: data.emergencyContact,
        employment_status: 'full_time',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockStaffData.push(newStaff);
      return newStaff;
    }

    const staffData: DatabaseStaffMemberInsert = {
      name: data.name,
      role: data.role,
      email: data.email,
      phone: data.phone,
      status: 'active',
      salary: data.salary,
      department: data.department,
      certifications: data.certifications,
      performance_rating: data.performance_rating || 0,
      shift: data.shift,
      address: data.address,
      schedule: data.schedule,
      bank_info: data.bankInfo,
      emergency_contact: data.emergencyContact,
      employment_status: 'full_time',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: newStaff, error } = await supabase
      .from('staff_members')
      .insert(staffData)
      .select()
      .single();

    if (error) throw error;
    if (!newStaff) throw new Error('Failed to create staff member');

    return newStaff;
  } catch (error) {
    console.error('Error creating staff member:', error);
    throw error;
  }
};

export const updateStaffMemberStatus = async (staffId: number, newStatus: StaffMember["status"]): Promise<void> => {
  try {
    const tableExists = await checkTableExists();

    if (!tableExists) {
      console.warn('Staff members table does not exist, using mock data');
      const staffIndex = mockStaffData.findIndex(s => s.id === staffId);
      if (staffIndex !== -1) {
        mockStaffData[staffIndex].status = newStatus;
      }
      return;
    }

    const { error } = await supabase
      .from('staff_members')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', staffId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating staff status:', error);
    throw error;
  }
};

export const updateStaffMemberInfo = async (staffId: number, updates: Partial<DatabaseStaffMember>): Promise<void> => {
  try {
    const tableExists = await checkTableExists();

    if (!tableExists) {
      console.warn('Staff members table does not exist, using mock data');
      const staffIndex = mockStaffData.findIndex(s => s.id === staffId);
      if (staffIndex !== -1) {
        mockStaffData[staffIndex] = { ...mockStaffData[staffIndex], ...updates };
      }
      return;
    }

    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('staff_members')
      .update(updateData)
      .eq('id', staffId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating staff info:', error);
    throw error;
  }
};
