
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";
import type { DatabaseStaffMember } from "./staff/types/databaseTypes";
import { mapDatabaseToStaffMember } from "./staff/utils/staffMapper";
import { 
  fetchStaffMembers, 
  createStaffMember, 
  updateStaffMemberStatus, 
  updateStaffMemberInfo 
} from "./staff/services/staffService";

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
      setStaff(data.map((item: DatabaseStaffMember) => mapDatabaseToStaffMember(item)));
      
      toast({
        title: "Staff list updated",
        description: "The staff list has been refreshed.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error fetching staff:', error);
      setError(errorMessage);
      toast({
        title: "Error fetching staff",
        description: errorMessage,
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
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error adding staff member:', error);
      toast({
        title: "Error adding staff member",
        description: errorMessage,
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
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error updating staff status:', error);
      toast({
        title: "Error updating status",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateStaffInfo = async (staffId: number, updates: Partial<DatabaseStaffMember>) => {
    try {
      await updateStaffMemberInfo(staffId, updates);
      const updatedMember = staff.find(m => m.id === staffId);
      if (!updatedMember) throw new Error('Staff member not found');
      
      const updatedData = { ...updatedMember, ...updates };
      const mappedMember = mapDatabaseToStaffMember(updatedData as DatabaseStaffMember);
      
      setStaff(prev => prev.map(member => 
        member.id === staffId ? mappedMember : member
      ));
      
      toast({
        title: "Staff info updated",
        description: "Staff member information has been updated successfully.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error updating staff info:', error);
      toast({
        title: "Error updating info",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    staff,
    loading,
    error,
    setStaff,
    addStaffMember,
    updateStaffStatus,
    updateStaffInfo,
    refreshStaffList: fetchStaff,
  };
};
