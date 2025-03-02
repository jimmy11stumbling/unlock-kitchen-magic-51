
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember, StaffStatus } from "@/types/staff";

export const addStaffMember = async (staffData: Omit<StaffMember, "id" | "status">) => {
  try {
    const newStaff = {
      id: Math.floor(Math.random() * 1000) + 100,
      status: 'active' as const,
      ...staffData
    };
    
    console.log('Added new staff member:', newStaff);
    return newStaff as StaffMember;
  } catch (error) {
    console.error('Error adding staff member:', error);
    throw error;
  }
};

export const updateStaffInfo = async (staffId: number, updates: Partial<StaffMember>) => {
  try {
    console.log(`Updated staff ${staffId} with:`, updates);
    // Create a mock response instead of using Supabase
    const mockStaff: StaffMember = {
      id: staffId,
      name: 'Mock Staff',
      role: 'server',
      email: 'mock@example.com',
      phone: '555-1234',
      status: 'active',
      salary: 35000,
      hireDate: '2023-01-01',
      ...updates
    };
    
    return mockStaff;
  } catch (error) {
    console.error('Error updating staff member:', error);
    throw error;
  }
};

export const updateStaffStatus = async (staffId: number, status: StaffStatus): Promise<StaffMember | null> => {
  try {
    // Instead of using Supabase, return a mock response
    console.log(`Updated staff ${staffId} status to ${status}`);
    
    const mockResponse: StaffMember = {
      id: staffId,
      name: 'Mock Staff',
      role: 'server',
      email: 'mock@example.com',
      phone: '555-1234',
      status,
      salary: 35000,
      hireDate: '2023-01-01',
    };
    
    return mockResponse;
  } catch (error) {
    console.error("Error updating staff status:", error);
    return null;
  }
};
