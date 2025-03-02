import { supabase } from "@/integrations/supabase/client";
import type { StaffStatus, StaffMember } from "@/types/staff";
import type { Json } from "@/integrations/supabase/types";

export type DatabaseStaffMemberInsert = {
  name: string;
  email?: string;
  phone?: string;
  role: "manager" | "chef" | "server" | "bartender" | "host";
  status: "active" | "on_break" | "off_duty"; // Database-compatible statuses
  // ... other fields
};

// Function to check if a table exists
const tableExists = async (tableName: string) => {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(1);
  
  return !error;
};

export const writeQueries = {
  saveStaffMember: async (staffMember: Partial<DatabaseStaffMemberInsert>) => {
    try {
      // Ensure status is within allowed values
      let safeData = { ...staffMember };
      if (staffMember.status && typeof staffMember.status === 'string') {
        safeData.status = (['active', 'on_break', 'off_duty'].includes(staffMember.status)
          ? staffMember.status
          : 'active') as "active" | "on_break" | "off_duty";
      }

      const { data, error } = await supabase
        .from('staff_members')
        .insert(safeData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving staff member:', error);
      throw error;
    }
  },

  updateStaffMember: async (id: number, updates: Partial<DatabaseStaffMemberInsert>) => {
    try {
      // Ensure status is within allowed values for db
      let safeUpdates = { ...updates };
      if (updates.status && typeof updates.status === 'string') {
        safeUpdates.status = (['active', 'on_break', 'off_duty'].includes(updates.status)
          ? updates.status
          : 'active') as "active" | "on_break" | "off_duty";
      }

      const { data, error } = await supabase
        .from('staff_members')
        .update(safeUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating staff member:', error);
      throw error;
    }
  },

  seedInitialData: async () => {
    // Check if table exists and has data
    const exists = await tableExists('staff_members');
    if (!exists) {
      console.log('Staff members table does not exist or is not accessible.');
      return false;
    }

    // Get current count of staff members
    const { count, error: countError } = await supabase
      .from('staff_members')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error checking staff count:', countError);
      return false;
    }

    // Only seed if no records exist
    if (count && count > 0) {
      console.log('Staff data already exists, skipping seed.');
      return false;
    }

    // Initial data with valid status values
    const initialStaffData = [
      {
        name: "John Doe",
        role: "manager" as const,
        email: "john@example.com",
        phone: "123-456-7890",
        status: "active" as "active" | "on_break" | "off_duty",
        salary: 65000,
        department: "Management"
      },
      {
        name: "Jane Smith",
        role: "chef" as const,
        email: "jane@example.com",
        phone: "123-456-7891",
        status: "active" as "active" | "on_break" | "off_duty",
        salary: 55000,
        department: "Kitchen"
      }
    ];

    // Insert initial data
    for (const staff of initialStaffData) {
      try {
        await supabase.from('staff_members').insert(staff);
      } catch (error) {
        console.error('Error seeding staff data:', error);
        return false;
      }
    }

    return true;
  }
};
