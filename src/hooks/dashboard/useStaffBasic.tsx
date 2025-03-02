import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember, StaffDTO } from "@/types/staff";
import { staffMappers } from "./staff/utils/staffMapper";

export const useStaffBasic = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStaff();
    subscribeToStaffChanges();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('staff_members')
        .select('*');

      if (error) {
        console.error("Error fetching staff:", error);
        toast({
          title: "Error",
          description: "Failed to fetch staff data",
          variant: "destructive"
        });
        return;
      }

      const mappedStaff: StaffMember[] = (data as StaffDTO[]).map(staffDTO => ({
        id: staffDTO.id,
        name: staffDTO.name,
        role: staffDTO.role || 'kitchen_staff',
        email: staffDTO.email || '',
        phone: staffDTO.phone || '',
        status: staffDTO.status as StaffMember['status'] || 'active',
        salary: staffDTO.salary || 0,
        hireDate: staffDTO.hire_date || new Date().toISOString(),
        schedule: staffMappers.parseSchedule(staffDTO.schedule),
        certifications: staffMappers.parseCertifications(staffDTO.certifications),
        performanceRating: staffDTO.performance_rating || 0,
        notes: staffDTO.notes || '',
        department: staffDTO.department || '',
        shift: staffDTO.shift || '',
      }));

      setStaff(mappedStaff);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast({
        title: "Error",
        description: "Failed to fetch staff data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToStaffChanges = () => {
    supabase
      .channel('public:staff_members')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'staff_members' }, (payload) => {
        console.log('Change received!', payload);
        fetchStaff();
      })
      .subscribe()
  };

  const addStaffMember = async (data: Omit<StaffMember, "id" | "status">): Promise<StaffMember> => {
    try {
      const { data: newStaff, error } = await supabase
        .from('staff_members')
        .insert([
          {
            name: data.name,
            role: data.role,
            email: data.email,
            phone: data.phone,
            salary: data.salary,
            hire_date: data.hireDate,
            schedule: data.schedule ? JSON.stringify(data.schedule) : null,
            certifications: data.certifications ? JSON.stringify(data.certifications) : null,
            performance_rating: data.performanceRating,
            notes: data.notes,
            department: data.department,
            status: 'active',
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("Error adding staff member:", error);
        toast({
          title: "Error",
          description: "Failed to add staff member",
          variant: "destructive"
        });
        throw error;
      }

      const staffDTO = newStaff as StaffDTO;
      const mappedStaffMember: StaffMember = {
        id: staffDTO.id,
        name: staffDTO.name,
        role: staffDTO.role || 'kitchen_staff',
        email: staffDTO.email || '',
        phone: staffDTO.phone || '',
        status: staffDTO.status as StaffMember['status'] || 'active',
        salary: staffDTO.salary || 0,
        hireDate: staffDTO.hire_date || new Date().toISOString(),
        schedule: staffMappers.parseSchedule(staffDTO.schedule),
        certifications: staffMappers.parseCertifications(staffDTO.certifications),
        performanceRating: staffDTO.performance_rating || 0,
        notes: staffDTO.notes || '',
        department: staffDTO.department || '',
        shift: staffDTO.shift || '',
      };

      setStaff(prevStaff => [...prevStaff, mappedStaffMember]);
      return mappedStaffMember;
    } catch (error) {
      console.error("Error adding staff member:", error);
      toast({
        title: "Error",
        description: "Failed to add staff member",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateStaffStatus = async (staffId: number, newStatus: StaffMember["status"]): Promise<void> => {
    try {
      const { error } = await supabase
        .from('staff_members')
        .update({ status: newStatus })
        .eq('id', staffId);

      if (error) {
        console.error("Error updating staff status:", error);
        toast({
          title: "Error",
          description: "Failed to update staff status",
          variant: "destructive"
        });
        throw error;
      }

      setStaff(prevStaff =>
        prevStaff.map(member =>
          member.id === staffId ? { ...member, status: newStatus } : member
        )
      );
    } catch (error) {
      console.error("Error updating staff status:", error);
      toast({
        title: "Error",
        description: "Failed to update staff status",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateStaffInfo = async (staffId: number, updates: Partial<StaffMember>): Promise<void> => {
    try {
      const staffMemberUpdates: Partial<StaffDTO> = {};

      if (updates.name !== undefined) staffMemberUpdates.name = updates.name;
      if (updates.role !== undefined) staffMemberUpdates.role = updates.role;
      if (updates.email !== undefined) staffMemberUpdates.email = updates.email;
      if (updates.phone !== undefined) staffMemberUpdates.phone = updates.phone;
      if (updates.salary !== undefined) staffMemberUpdates.salary = updates.salary;
      if (updates.hireDate !== undefined) staffMemberUpdates.hire_date = updates.hireDate;
      if (updates.schedule !== undefined) staffMemberUpdates.schedule = JSON.stringify(updates.schedule);
      if (updates.certifications !== undefined) staffMemberUpdates.certifications = JSON.stringify(updates.certifications);
      if (updates.performanceRating !== undefined) staffMemberUpdates.performance_rating = updates.performanceRating;
      if (updates.notes !== undefined) staffMemberUpdates.notes = updates.notes;
      if (updates.department !== undefined) staffMemberUpdates.department = updates.department;
      if (updates.shift !== undefined) staffMemberUpdates.shift = updates.shift;

      const { error } = await supabase
        .from('staff_members')
        .update(staffMemberUpdates)
        .eq('id', staffId);

      if (error) {
        console.error("Error updating staff info:", error);
        toast({
          title: "Error",
          description: "Failed to update staff information",
          variant: "destructive"
        });
        throw error;
      }

      setStaff(prevStaff =>
        prevStaff.map(member =>
          member.id === staffId ? { ...member, ...updates } : member
        )
      );
    } catch (error) {
      console.error("Error updating staff info:", error);
      toast({
        title: "Error",
        description: "Failed to update staff information",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    staff,
    loading,
    addStaffMember,
    updateStaffStatus,
    updateStaffInfo
  };
};
