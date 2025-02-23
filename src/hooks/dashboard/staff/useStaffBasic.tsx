
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember, StaffRole } from "@/types/staff";

interface DatabaseStaffMember {
  id: number;
  name: string;
  role: StaffRole;
  email: string | null;
  phone: string | null;
  status: 'active' | 'on_break' | 'off_duty';
  salary: number | null;
  shift: string | null;
  department: string | null;
  certifications: string[] | null;
  performance_rating: number | null;
  notes: string | null;
  schedule: Record<string, string> | string;
  bank_info: Record<string, any> | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useStaffBasic = () => {
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  const mapDatabaseToStaffMember = (dbStaff: DatabaseStaffMember): StaffMember => {
    let schedule = typeof dbStaff.schedule === 'string' 
      ? JSON.parse(dbStaff.schedule)
      : dbStaff.schedule || {};

    return {
      id: dbStaff.id,
      name: dbStaff.name,
      role: dbStaff.role,
      status: dbStaff.status,
      shift: dbStaff.shift || '',
      salary: dbStaff.salary || 0,
      email: dbStaff.email || '',
      phone: dbStaff.phone || '',
      address: '', // Default empty as it's not in DB
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      },
      startDate: dbStaff.created_at || new Date().toISOString(),
      department: dbStaff.department || '',
      certifications: dbStaff.certifications || [],
      performanceRating: dbStaff.performance_rating || 0,
      notes: dbStaff.notes || '',
      schedule: {
        monday: schedule.monday || 'OFF',
        tuesday: schedule.tuesday || 'OFF',
        wednesday: schedule.wednesday || 'OFF',
        thursday: schedule.thursday || 'OFF',
        friday: schedule.friday || 'OFF',
        saturday: schedule.saturday || 'OFF',
        sunday: schedule.sunday || 'OFF'
      },
      bankInfo: {
        accountNumber: dbStaff.bank_info?.accountNumber || '',
        routingNumber: dbStaff.bank_info?.routingNumber || '',
        accountType: dbStaff.bank_info?.accountType || 'checking'
      }
    };
  };

  useEffect(() => {
    fetchStaff();

    const channel = supabase
      .channel('staff-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'staff_members' },
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchStaff();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from('staff_members')
        .select('*');

      if (error) throw error;
      
      const mappedStaff = (data || []).map((item) => mapDatabaseToStaffMember(item as DatabaseStaffMember));
      setStaff(mappedStaff);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast({
        title: "Error fetching staff",
        description: "There was a problem loading the staff list.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addStaffMember = async (data: Omit<StaffMember, "id" | "status">) => {
    try {
      const { data: newStaff, error } = await supabase
        .from('staff_members')
        .insert({
          name: data.name,
          role: data.role,
          email: data.email,
          phone: data.phone,
          salary: data.salary,
          department: data.department,
          certifications: data.certifications,
          schedule: data.schedule,
          bank_info: data.bankInfo
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Staff member added",
        description: `${data.name} has been added to the staff list.`,
      });

      return mapDatabaseToStaffMember(newStaff as DatabaseStaffMember);
    } catch (error) {
      console.error('Error adding staff member:', error);
      toast({
        title: "Error adding staff member",
        description: "There was a problem adding the staff member.",
        variant: "destructive",
      });
    }
  };

  const updateStaffStatus = async (staffId: number, newStatus: StaffMember["status"]) => {
    try {
      const { error } = await supabase
        .from('staff_members')
        .update({ status: newStatus })
        .eq('id', staffId);

      if (error) throw error;

      const member = staff.find(m => m.id === staffId);
      toast({
        title: "Status updated",
        description: `${member?.name}'s status has been updated to ${newStatus.replace("_", " ")}.`,
      });
    } catch (error) {
      console.error('Error updating staff status:', error);
      toast({
        title: "Error updating status",
        description: "There was a problem updating the staff member's status.",
        variant: "destructive",
      });
    }
  };

  const updateStaffInfo = async (staffId: number, updates: Partial<DatabaseStaffMember>) => {
    try {
      const { error } = await supabase
        .from('staff_members')
        .update(updates)
        .eq('id', staffId);

      if (error) throw error;

      toast({
        title: "Staff info updated",
        description: "Staff member information has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating staff info:', error);
      toast({
        title: "Error updating info",
        description: "There was a problem updating the staff member's information.",
        variant: "destructive",
      });
    }
  };

  return {
    staff,
    loading,
    setStaff,
    addStaffMember,
    updateStaffStatus,
    updateStaffInfo,
  };
};
