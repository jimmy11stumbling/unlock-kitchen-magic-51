
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";
import type { DatabaseStaffMember } from "./types/databaseTypes";
import { mapDatabaseToStaffMember } from "./utils/staffMapper";
import { 
  fetchStaffMembers, 
  createStaffMember, 
  updateStaffMemberStatus, 
  updateStaffMemberInfo 
} from "./services/staffService";

export const useStaffBasic = () => {
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setLoading(true);
      setError(null);
      const data = await fetchStaffMembers();
      const mappedStaff = data.map((item) => mapDatabaseToStaffMember(item));
      setStaff(mappedStaff);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setError('Failed to fetch staff members');
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
      const newStaff = await createStaffMember(data);
      const mappedStaffMember = mapDatabaseToStaffMember(newStaff);
      setStaff(prev => [...prev, mappedStaffMember]);
      toast({
        title: "Staff member added",
        description: `${data.name} has been added to the staff list.`,
      });
      return mappedStaffMember;
    } catch (error) {
      console.error('Error adding staff member:', error);
      toast({
        title: "Error adding staff member",
        description: "There was a problem adding the staff member.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateStaffStatus = async (staffId: number, newStatus: StaffMember["status"]) => {
    try {
      await updateStaffMemberStatus(staffId, newStatus);
      setStaff(prev => prev.map(member => 
        member.id === staffId 
          ? { ...member, status: newStatus }
          : member
      ));
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
      throw error;
    }
  };

  const updateStaffInfo = async (staffId: number, updates: Partial<DatabaseStaffMember>) => {
    try {
      await updateStaffMemberInfo(staffId, updates);
      setStaff(prev => prev.map(member => 
        member.id === staffId 
          ? { ...member, ...updates }
          : member
      ));
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
      throw error;
    }
  };

  const refreshStaffList = () => {
    fetchStaff();
  };

  return {
    staff,
    loading,
    error,
    setStaff,
    addStaffMember,
    updateStaffStatus,
    updateStaffInfo,
    refreshStaffList,
  };
};
