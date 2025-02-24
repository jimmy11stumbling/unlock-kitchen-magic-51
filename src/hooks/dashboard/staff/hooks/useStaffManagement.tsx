
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";
import type { DatabaseStaffMember } from "../types/databaseTypes";
import { mapDatabaseToStaffMember } from "../utils/staffMapper";
import { 
  fetchStaffMembers, 
  createStaffMember, 
  updateStaffMemberStatus, 
  updateStaffMemberInfo,
  searchStaffMembers,
  getStaffByDepartment 
} from "../services/queries/staffQueries";

export const useStaffManagement = () => {
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchStaffMembers();
      setStaff(data.map((item: DatabaseStaffMember) => mapDatabaseToStaffMember(item)));
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
        description: `${member?.name}'s status has been updated to ${newStatus}.`,
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
      console.error('Error updating staff info:', error);
      toast({
        title: "Error updating info",
        description: "There was a problem updating the staff member's information.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const searchStaff = async (query: string) => {
    try {
      const results = await searchStaffMembers(query);
      return results.map(item => mapDatabaseToStaffMember(item));
    } catch (error) {
      console.error('Error searching staff:', error);
      toast({
        title: "Error searching staff",
        description: "There was a problem searching for staff members.",
        variant: "destructive",
      });
      return [];
    }
  };

  const getStaffInDepartment = async (department: string) => {
    try {
      const results = await getStaffByDepartment(department);
      return results.map(item => mapDatabaseToStaffMember(item));
    } catch (error) {
      console.error('Error fetching department staff:', error);
      toast({
        title: "Error fetching department staff",
        description: "There was a problem loading the department staff list.",
        variant: "destructive",
      });
      return [];
    }
  };

  return {
    staff,
    loading,
    error,
    setStaff,
    fetchStaff,
    addStaffMember,
    updateStaffStatus,
    updateStaffInfo,
    searchStaff,
    getStaffInDepartment,
  };
};
