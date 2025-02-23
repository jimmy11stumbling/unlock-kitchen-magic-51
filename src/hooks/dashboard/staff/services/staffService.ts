
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";
import type { DatabaseStaffMember } from "../types/databaseTypes";

export const fetchStaffMembers = async () => {
  try {
    // First, check if table exists and create it if it doesn't
    const createTableSQL = `
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'staff_members') THEN
          CREATE TABLE public.staff_members (
            id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
            name text NOT NULL,
            role text NOT NULL,
            email text,
            phone text,
            status text NOT NULL DEFAULT 'active',
            salary numeric,
            department text,
            certifications text[],
            schedule jsonb,
            bank_info jsonb,
            performance_rating numeric DEFAULT 0,
            shift text,
            address text,
            emergency_contact jsonb,
            created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
          );

          ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Allow authenticated users to read staff_members"
            ON public.staff_members FOR SELECT
            TO authenticated
            USING (true);

          CREATE POLICY "Allow authenticated users to insert staff_members"
            ON public.staff_members FOR INSERT
            TO authenticated
            WITH CHECK (true);

          CREATE POLICY "Allow authenticated users to update staff_members"
            ON public.staff_members FOR UPDATE
            TO authenticated
            USING (true);
        END IF;
      END $$;
    `;

    const { error: setupError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    if (setupError) {
      console.error('Error setting up table:', setupError);
      return [];
    }

    const { data, error } = await supabase
      .from('staff_members')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching staff:', error);
      return [];
    }

    // Transform the data to match DatabaseStaffMember type
    const transformedData = data.map(staff => ({
      ...staff,
      emergency_contact: staff.emergency_contact as DatabaseStaffMember['emergency_contact'],
      bank_info: staff.bank_info as DatabaseStaffMember['bank_info'],
      schedule: staff.schedule as DatabaseStaffMember['schedule']
    }));

    return transformedData as DatabaseStaffMember[];
  } catch (error) {
    console.error('Error in fetchStaffMembers:', error);
    return [];
  }
};

export const createStaffMember = async (data: Omit<StaffMember, "id" | "status">) => {
  const staffData = {
    name: data.name,
    role: data.role,
    email: data.email,
    phone: data.phone,
    status: 'active' as const, // Default status for new staff
    salary: data.salary,
    department: data.department,
    certifications: data.certifications,
    schedule: data.schedule,
    bank_info: data.bankInfo,
    performance_rating: 0, // Default rating for new staff
    shift: data.shift || 'day',
    address: data.address || '',
    emergency_contact: data.emergencyContact || null
  };

  const { data: newStaff, error } = await supabase
    .from('staff_members')
    .insert(staffData)
    .select()
    .single();

  if (error) {
    console.error('Error creating staff member:', error);
    throw error;
  }

  return {
    ...newStaff,
    emergency_contact: newStaff.emergency_contact as DatabaseStaffMember['emergency_contact'],
    bank_info: newStaff.bank_info as DatabaseStaffMember['bank_info'],
    schedule: newStaff.schedule as DatabaseStaffMember['schedule']
  } as DatabaseStaffMember;
};

export const updateStaffMemberStatus = async (staffId: number, newStatus: StaffMember["status"]) => {
  const { error } = await supabase
    .from('staff_members')
    .update({ status: newStatus })
    .eq('id', staffId);

  if (error) {
    console.error('Error updating staff status:', error);
    throw error;
  }
};

export const updateStaffMemberInfo = async (staffId: number, updates: Partial<DatabaseStaffMember>) => {
  const { error } = await supabase
    .from('staff_members')
    .update(updates)
    .eq('id', staffId);

  if (error) {
    console.error('Error updating staff info:', error);
    throw error;
  }
};
