import { supabase } from '@/integrations/supabase/client';
import type { StaffMember } from '@/types/staff/employee';
import type { Json } from '@/integrations/supabase/types';
import { mapStaffMemberToDatabase } from '../../utils/staffMapper';

// Type to match the database insert requirements
type DatabaseStaffMemberInsert = {
  name: string;
  role: 'manager' | 'chef' | 'server' | 'bartender' | 'host';
  email?: string;
  phone?: string;
  address?: string;
  department?: string;
  certifications?: string[];
  performance_rating?: number;
  status: 'active' | 'on_break' | 'off_duty';
  notes?: string;
  schedule?: Json;
  salary?: number;
  hourly_rate?: number;
  overtime_rate?: number;
  shift?: string;
  emergency_contact?: Json;
  bank_info?: Json;
  benefits?: Json;
  employment_status?: 'full_time' | 'part_time' | 'contract' | 'terminated';
  tax_id?: string;
  created_at: string;
  updated_at: string;
};

export const createStaffMember = async (
  staffData: Omit<StaffMember, 'id'>
): Promise<number | null> => {
  try {
    // Convert from app type to database type
    const dbStaffData = mapStaffMemberToDatabase(staffData);
    
    // Add created_at timestamp
    const dataToInsert = {
      ...dbStaffData,
      created_at: new Date().toISOString(),
      status: 'active' as const, // Ensure this matches database enum
    };
    
    const { data, error } = await supabase
      .from('staff_members')
      .insert(dataToInsert)
      .select();
    
    if (error) throw error;
    
    return data?.[0]?.id || null;
  } catch (error) {
    console.error('Error creating staff member:', error);
    return null;
  }
};

export const updateStaffMember = async (
  staffId: number,
  updates: Partial<StaffMember>
): Promise<boolean> => {
  try {
    // Convert status from app format to database format if needed
    let dbStatus: 'active' | 'on_break' | 'off_duty' | undefined;
    let employmentStatus: 'full_time' | 'part_time' | 'contract' | 'terminated' | undefined;
    
    if (updates.status) {
      if (updates.status === 'on_break') {
        dbStatus = 'on_break';
      } else if (updates.status === 'off_duty') {
        dbStatus = 'off_duty';
      } else if (updates.status === 'terminated') {
        employmentStatus = 'terminated';
        dbStatus = 'active'; // Default since database doesn't have terminated
      } else {
        dbStatus = 'active';
      }
    }
    
    // Prepare the updates object with snakecase keys for database
    const dbUpdates: any = {
      updated_at: new Date().toISOString()
    };
    
    // Map fields from the updates object
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.role) dbUpdates.role = updates.role;
    if (dbStatus) dbUpdates.status = dbStatus;
    if (employmentStatus) dbUpdates.employment_status = employmentStatus;
    if (updates.email) dbUpdates.email = updates.email;
    if (updates.phone) dbUpdates.phone = updates.phone;
    if (updates.address) dbUpdates.address = updates.address;
    if (updates.department) dbUpdates.department = updates.department;
    if (updates.certifications) dbUpdates.certifications = updates.certifications;
    if (updates.performanceRating) dbUpdates.performance_rating = updates.performanceRating;
    if (updates.notes) dbUpdates.notes = updates.notes;
    if (updates.schedule) dbUpdates.schedule = updates.schedule;
    if (updates.salary) dbUpdates.salary = updates.salary;
    if (updates.hourlyRate) dbUpdates.hourly_rate = updates.hourlyRate;
    if (updates.overtimeRate) dbUpdates.overtime_rate = updates.overtimeRate;
    if (updates.shift) dbUpdates.shift = updates.shift;
    if (updates.emergencyContact) dbUpdates.emergency_contact = updates.emergencyContact;
    if (updates.bankInfo) dbUpdates.bank_info = updates.bankInfo;
    if (updates.hireDate) dbUpdates.hire_date = updates.hireDate;
    
    const { error } = await supabase
      .from('staff_members')
      .update(dbUpdates)
      .eq('id', staffId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating staff member:', error);
    return false;
  }
};

export const updateStaffMemberStatus = async (staffId: number, newStatus: StaffMember["status"]): Promise<void> => {
  try {
    const tableExists = await checkTableExists();

    if (!tableExists) {
      console.warn('Staff members table does not exist, using mock data');
      const staffIndex = mockStaffData.findIndex(s => s.id === staffId);
      if (staffIndex !== -1) {
        mockStaffData[staffIndex].status = newStatus === 'terminated' || newStatus === 'on_leave' 
          ? 'off_duty'
          : newStatus;
      }
      return;
    }

    let dbStatus = newStatus;
    if (newStatus === 'terminated' || newStatus === 'on_leave') {
      dbStatus = 'off_duty';
    }

    const { error } = await supabase
      .from('staff_members')
      .update({ 
        status: dbStatus,
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
        if (updates.status && (updates.status === 'terminated' || updates.status === 'on_leave')) {
          updates.status = 'off_duty';
        }
        mockStaffData[staffIndex] = { ...mockStaffData[staffIndex], ...updates };
      }
      return;
    }

    let updateData = { ...updates };
    if (updateData.status && (updateData.status === 'terminated' || updateData.status === 'on_leave')) {
      updateData.status = 'off_duty';
    }

    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('staff_members')
      .update(updateData as any)
      .eq('id', staffId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating staff info:', error);
    throw error;
  }
};
