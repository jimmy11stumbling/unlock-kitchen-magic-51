
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
        overtime_rate: data.overtimeRate || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tax_id: ""
      };
      mockStaffData.push(newStaff);
      return newStaff;
    }

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
      overtime_rate: data.overtimeRate || 0,
      tax_id: ""
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
    const tableExists = await checkTableExists();

    if (!tableExists) {
      console.warn('Staff members table does not exist, updating mock data');
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
    const tableExists = await checkTableExists();

    if (!tableExists) {
      console.warn('Staff members table does not exist, updating mock data');
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

    if (error) {
      console.error('Error updating staff info:', error);
      throw new Error(`Failed to update staff info: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in updateStaffMemberInfo:', error);
    throw error;
  }
};
