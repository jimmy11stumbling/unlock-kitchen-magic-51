
import { supabase } from '@/integrations/supabase/client';
import type { DatabaseStaffMemberInsert } from '../../types/databaseTypes';
import type { StaffMember } from '@/types/staff/employee';
import { mapStaffMemberToDatabase } from '../../utils/staffMapper';

// Mock data for when table doesn't exist
import { mockStaffData } from '../mockData/mockStaffData';

// Check if the staff_members table exists in the database
export const checkTableExists = async (): Promise<boolean> => {
  try {
    // This is a proper way to check if a table exists in Supabase
    const { data, error } = await supabase
      .from('staff_members')
      .select('id')
      .limit(1);
    
    return !error; // If there's no error, the table exists
  } catch (error) {
    console.error('Error checking table existence:', error);
    return false;
  }
};

// Create a new staff member
export const createStaffMember = async (staffData: Omit<StaffMember, 'id'>): Promise<StaffMember> => {
  try {
    const tableExists = await checkTableExists();
    
    if (!tableExists) {
      console.warn('Staff members table does not exist, using mock data');
      // Create a new mock staff member with an ID
      const newId = Math.max(...mockStaffData.map(s => s.id)) + 1;
      const newStaff = {
        id: newId,
        name: staffData.name || '',
        email: staffData.email,
        phone: staffData.phone,
        role: staffData.role || 'server',
        department: staffData.department,
        status: staffData.status as any || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Add other required properties based on DatabaseStaffMember type
        performance_rating: 0,
        certifications: [],
        notes: '',
        schedule: {},
        salary: 0
      };
      
      // In a real app, we would insert this into the database
      // For now, just return the mock data
      return {
        id: newId,
        name: staffData.name || '',
        email: staffData.email,
        phone: staffData.phone,
        role: staffData.role || 'server',
        department: staffData.department,
        status: staffData.status || 'active',
        // Add other properties from staffData
        ...staffData
      };
    }
    
    // Transform the staff data to match the database schema
    const dbStaffData = mapStaffMemberToDatabase(staffData);
    
    const { data, error } = await supabase
      .from('staff_members')
      .insert(dbStaffData)
      .select('*')
      .single();
    
    if (error) throw error;
    
    // Map the database result back to a StaffMember
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      department: data.department,
      status: data.status,
      // Add other properties from StaffMember
      ...staffData
    };
  } catch (error) {
    console.error('Error creating staff member:', error);
    throw error;
  }
};

// Update a staff member's status
export const updateStaffStatus = async (staffId: number, status: string): Promise<boolean> => {
  try {
    const tableExists = await checkTableExists();
    
    if (!tableExists) {
      console.warn('Staff members table does not exist, using mock data');
      // Find the staff member in mock data and update their status
      const staffIndex = mockStaffData.findIndex(s => s.id === staffId);
      if (staffIndex >= 0) {
        mockStaffData[staffIndex].status = status as any;
        return true;
      }
      return false;
    }
    
    const { error } = await supabase
      .from('staff_members')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', staffId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating staff status:', error);
    throw error;
  }
};

// Update staff member information
export const updateStaffInfo = async (staffId: number, updates: Partial<StaffMember>): Promise<StaffMember> => {
  try {
    const tableExists = await checkTableExists();
    
    if (!tableExists) {
      console.warn('Staff members table does not exist, using mock data');
      // Find the staff member in mock data and update their information
      const staffIndex = mockStaffData.findIndex(s => s.id === staffId);
      if (staffIndex >= 0) {
        // Update mock data with the new information
        const updatedStaff = { ...mockStaffData[staffIndex], ...mapStaffMemberToDatabase(updates), updated_at: new Date().toISOString() };
        mockStaffData[staffIndex] = updatedStaff;
        
        // Convert to StaffMember type and return
        return {
          id: updatedStaff.id,
          name: updatedStaff.name,
          email: updatedStaff.email,
          phone: updatedStaff.phone,
          role: updatedStaff.role,
          status: updatedStaff.status,
          // Add other properties
          ...updates
        };
      }
      throw new Error('Staff member not found');
    }
    
    // Transform updates to match database schema
    const dbUpdates = mapStaffMemberToDatabase(updates);
    dbUpdates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('staff_members')
      .update(dbUpdates)
      .eq('id', staffId)
      .select('*')
      .single();
    
    if (error) throw error;
    
    // Map the database result back to a StaffMember
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      department: data.department,
      status: data.status,
      // Add other required properties
      ...updates
    };
  } catch (error) {
    console.error('Error updating staff information:', error);
    throw error;
  }
};
