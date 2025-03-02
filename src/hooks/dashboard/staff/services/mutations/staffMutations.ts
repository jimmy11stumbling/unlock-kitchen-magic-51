import { supabase } from '@/integrations/supabase/client';
import type { StaffMember, StaffStatus } from '@/types/staff';
import type { StaffRole } from '@/types/staff/role';
import { mapStaffMemberToDatabase } from '../../utils/staffMapper';

export const updateStaffEmploymentStatus = async (
  staffId: number,
  newStatus: 'full_time' | 'part_time' | 'contract' | 'terminated'
) => {
  try {
    // Map staff status for database
    let dbStatus: 'active' | 'on_break' | 'off_duty' = 'active';
    
    // Only update the employment_status field
    const { error } = await supabase
      .from('staff_members')
      .update({
        employment_status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', staffId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating staff employment status:', error);
    return false;
  }
};

export const updateStaffMemberStatus = async (
  staffId: number,
  newStatus: StaffStatus
) => {
  try {
    // Map the app status to database format
    let dbStatus: 'active' | 'on_break' | 'off_duty' = 'active';
    let employmentStatus: 'full_time' | 'part_time' | 'contract' | 'terminated' | undefined;
    
    if (newStatus === 'on_break') {
      dbStatus = 'on_break';
    } else if (newStatus === 'off_duty') {
      dbStatus = 'off_duty';
    } else if (newStatus === 'terminated') {
      employmentStatus = 'terminated';
      dbStatus = 'active'; // Default since database doesn't have terminated
    }
    
    // Prepare the update object
    const updates: any = {
      status: dbStatus,
      updated_at: new Date().toISOString()
    };
    
    // Only add employment_status if it's changing to terminated
    if (employmentStatus) {
      updates.employment_status = employmentStatus;
    }
    
    const { error } = await supabase
      .from('staff_members')
      .update(updates)
      .eq('id', staffId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating staff status:', error);
    return false;
  }
};

export const updateStaffMember = async (staffId: number, data: Partial<StaffMember>) => {
  try {
    // Handle the status field specially to match expected database enum values
    let updateData = { ...data };
    
    // Ensure status is compatible with database enum
    if (updateData.status) {
      // Map any incompatible statuses to allowed ones
      const status = updateData.status as StaffStatus;
      if (status === 'terminated' || status === 'on_leave') {
        // Map to compatible status for database
        updateData.status = 'off_duty';
      }
    }
    
    const { error } = await supabase
      .from('staff_members')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
        employment_status: data.employment_status as "full_time" | "part_time" | "contract" | "terminated"
      })
      .eq('id', staffId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating staff member:', error);
    throw error;
  }
};
