
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";
import type { DatabaseStaffMember, DatabaseStaffMemberInsert } from "../types/databaseTypes";

// Mock data to use when table doesn't exist
const mockStaffData: DatabaseStaffMember[] = [
  {
    id: 1,
    name: "John Smith",
    role: "manager",
    status: "active",
    shift: "Morning",
    salary: 65000,
    hourly_rate: 31.25,
    overtime_rate: 46.88,
    email: "john.smith@restaurant.com",
    phone: "555-0101",
    address: "123 Main St",
    emergency_contact: {
      name: "Jane Smith",
      phone: "555-0102",
      relationship: "spouse"
    },
    created_at: "2023-01-15",
    department: "management",
    certifications: ["ServSafe Manager", "Food Handler", "Alcohol Service"],
    performance_rating: 4.8,
    notes: "Regional manager for downtown locations",
    schedule: {
      monday: "9:00-17:00",
      tuesday: "9:00-17:00",
      wednesday: "9:00-17:00",
      thursday: "9:00-17:00",
      friday: "9:00-17:00",
      saturday: "OFF",
      sunday: "OFF"
    },
    bank_info: {
      accountNumber: "****1234",
      routingNumber: "****5678",
      accountType: "checking"
    },
    employment_status: "full_time",
    hire_date: "2023-01-15",
    benefits: {},
    updated_at: new Date().toISOString(),
    tax_id: "123-45-6789" // Added required tax_id field
  }
];

const checkTableExists = async () => {
  try {
    const { data: existingTable, error: checkError } = await supabase
      .from('staff_members')
      .select('id')
      .limit(1);

    return !checkError;
  } catch (error) {
    return false;
  }
};

export const fetchStaffMembers = async () => {
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
        tax_id: "" // Added required tax_id field
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
      tax_id: "" // Added required tax_id field
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
