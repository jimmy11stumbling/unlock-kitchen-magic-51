import { supabase } from '@/integrations/supabase/client';
import { DatabaseStaffMemberInsert, mapStaffStatusToDatabase } from '../../types/databaseTypes';
import type { StaffMember } from '@/types/staff/employee';
import { mapStaffMemberToDatabase } from '../../utils/staffMapper';

// Mock data for testing when Supabase is not available
import { initialStaff } from '@/hooks/dashboard/staff/useStaffBasic';

// Check if tables exist (for development and testing)
const tableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1);
    
    return !error;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
};

/**
 * Create a new staff member
 */
export const createStaffMember = async (
  staffData: Omit<StaffMember, 'id'>
): Promise<StaffMember | null> => {
  try {
    const dbStaffMember = mapStaffMemberToDatabase(staffData);
    
    // Ensure status is compatible with database
    if (dbStaffMember.status) {
      dbStaffMember.status = mapStaffStatusToDatabase(staffData.status as any);
    }

    // Check if staff_members table exists
    const hasTable = await tableExists('staff_members');
    
    if (!hasTable) {
      // If table doesn't exist, simulate adding to the initialStaff array
      console.log('Staff members table not found, using mock data');
      const newId = Math.max(...initialStaff.map(s => s.id)) + 1;
      const newStaff = {
        ...staffData,
        id: newId
      } as StaffMember;
      
      return newStaff;
    }

    const { data, error } = await supabase
      .from('staff_members')
      .insert(dbStaffMember as any)
      .select()
      .single();

    if (error) {
      console.error('Error creating staff member:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      status: data.status || 'active',
      hireDate: data.hire_date,
      department: data.department,
      salary: data.salary,
      // ... map other fields
    } as StaffMember;
  } catch (error) {
    console.error('Error in createStaffMember:', error);
    return null;
  }
};

/**
 * Update a staff member's status
 */
export const updateStaffStatus = async (
  staffId: number, 
  status: string
): Promise<boolean> => {
  try {
    // Map the status to a database compatible value
    const dbStatus = mapStaffStatusToDatabase(status as any);
    
    // Check if staff_members table exists
    const hasTable = await tableExists('staff_members');
    
    if (!hasTable) {
      // Mock update for testing
      console.log(`Updating staff ${staffId} status to ${status}`);
      return true;
    }

    const { error } = await supabase
      .from('staff_members')
      .update({ 
        status: dbStatus,
        updated_at: new Date().toISOString() 
      })
      .eq('id', staffId);

    if (error) {
      console.error(`Error updating staff ${staffId} status:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateStaffStatus:', error);
    return false;
  }
};

/**
 * Update staff member information
 */
export const updateStaffInfo = async (
  staffId: number, 
  updates: Partial<StaffMember>
): Promise<StaffMember | null> => {
  try {
    const dbUpdates = mapStaffMemberToDatabase(updates);
    
    // Ensure status is compatible with database if it exists
    if (updates.status) {
      dbUpdates.status = mapStaffStatusToDatabase(updates.status);
    }

    // Check if staff_members table exists  
    const hasTable = await tableExists('staff_members');
    
    if (!hasTable) {
      // Mock update for testing
      console.log(`Updating staff ${staffId} with:`, updates);
      return { ...updates, id: staffId } as StaffMember;
    }

    const { data, error } = await supabase
      .from('staff_members')
      .update({
        ...dbUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('id', staffId)
      .select()
      .single();

    if (error) {
      console.error(`Error updating staff ${staffId}:`, error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      status: data.status || 'active',
      // ... map other fields
    } as StaffMember;
  } catch (error) {
    console.error('Error in updateStaffInfo:', error);
    return null;
  }
};
