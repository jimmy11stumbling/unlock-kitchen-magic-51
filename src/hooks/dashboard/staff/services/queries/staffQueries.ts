
import { supabase } from "@/integrations/supabase/client";
import { checkTableExists } from "../utils/supabaseUtils";
import { mockStaffData } from "../mockData/mockStaffData";
import type { DatabaseStaffMember, DatabaseStaffMemberInsert } from "../../types/databaseTypes";
import type { StaffMember } from "@/types/staff";
import type { Database } from "@/integrations/supabase/types";

type EmploymentStatus = Database["public"]["Enums"]["employment_status"];

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

export const createStaffMember = async (data: Omit<StaffMember, "id" | "status">): Promise<DatabaseStaffMember> => {
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
        performance_rating: data.performanceRating,
        shift: data.shift,
        address: data.address,
        schedule: data.schedule,
        bank_info: data.bankInfo,
        emergency_contact: data.emergencyContact,
        notes: data.notes,
        employment_status: 'full_time',
        hire_date: data.startDate,
        benefits: {},
        hourly_rate: data.hourlyRate || 0,
        overtime_rate: data.overtimeRate || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        access_level: data.role === 'manager' ? 'admin' : 'staff',
        tax_id: ""
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
      performance_rating: data.performanceRating,
      shift: data.shift,
      address: data.address,
      schedule: data.schedule,
      bank_info: data.bankInfo,
      emergency_contact: data.emergencyContact,
      notes: data.notes,
      employment_status: 'full_time' as EmploymentStatus,
      hire_date: data.startDate,
      hourly_rate: data.hourlyRate || 0,
      overtime_rate: data.overtimeRate || 0
    };

    const { data: newStaff, error } = await supabase
      .from('staff_members')
      .insert(staffData)
      .select()
      .single();

    if (error) throw error;
    if (!newStaff) throw new Error('Failed to create staff member');

    return {
      ...newStaff,
      access_level: data.role === 'manager' ? 'admin' : 'staff'
    };
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
      .update({ status: newStatus })
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

    const { error } = await supabase
      .from('staff_members')
      .update(updates)
      .eq('id', staffId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating staff info:', error);
    throw error;
  }
};

export const hasAdminAccess = (staffMember: StaffMember | null): boolean => {
  if (!staffMember) return false;
  return staffMember.role === 'manager';
};
