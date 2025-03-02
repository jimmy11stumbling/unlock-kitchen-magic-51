import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { StaffMember } from "@/types/staff";
import { staffMappers } from "./staff/utils/staffMapper";
import { supabase } from "@/integrations/supabase/client";

const initialStaff: StaffMember[] = [
  {
    id: 1,
    name: "John Doe",
    role: "manager",
    email: "john.doe@restaurant.com",
    phone: "555-123-4567",
    status: "active",
    salary: 65000,
    hireDate: "2020-01-15",
    schedule: {
      monday: "09:00-17:00",
      tuesday: "09:00-17:00",
      wednesday: "09:00-17:00",
      thursday: "09:00-17:00",
      friday: "09:00-17:00",
      saturday: "OFF",
      sunday: "OFF"
    },
    certifications: ["Food Safety", "Management"],
    performanceRating: 9,
    notes: "Restaurant manager with 8 years of experience",
    department: "management",
  },
  // ... keep existing code (other staff member objects)
];

export const useStaffBasic = () => {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStaffMembers = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Error fetching staff:", error);
        toast({
          title: "Error",
          description: "Failed to load staff data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStaffMembers();
  }, [toast]);

  const addStaffMember = async (data: Omit<StaffMember, "id" | "status">) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newStaffMember: StaffMember = {
        ...data,
        id: Math.max(...staff.map(s => s.id)) + 1,
        status: "active",
      };
      
      setStaff([...staff, newStaffMember]);
      
      toast({
        title: "Success",
        description: `${data.name} has been added to the staff`,
      });
      
      return newStaffMember;
    } catch (error) {
      console.error("Error adding staff member:", error);
      toast({
        title: "Error",
        description: "Failed to add staff member",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStaffStatus = async (staffId: number, newStatus: StaffMember["status"]) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setStaff(staff.map(member => 
        member.id === staffId ? { ...member, status: newStatus } : member
      ));
      
      toast({
        title: "Status Updated",
        description: `Staff member's status has been updated to ${newStatus.replace('_', ' ')}`,
      });
      
      return true;
    } catch (error) {
      console.error("Error updating staff status:", error);
      toast({
        title: "Error",
        description: "Failed to update staff status",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStaffInfo = async (staffId: number, updates: Partial<StaffMember>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStaff(staff.map(member => 
        member.id === staffId ? { ...member, ...updates } : member
      ));
      
      toast({
        title: "Information Updated",
        description: "Staff member's information has been updated",
      });
      
      return true;
    } catch (error) {
      console.error("Error updating staff info:", error);
      toast({
        title: "Error",
        description: "Failed to update staff information",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getStaffMember = (id: number) => {
    return staff.find(member => member.id === id);
  };

  const calculateAttendance = (staffId: number) => {
    const member = staff.find(s => s.id === staffId);
    if (!member) return 0;

    const scheduledDays = Object.values(member.schedule || {}).filter(day => day !== "OFF").length;
    const totalPossibleDays = 7;
    
    return Math.round((scheduledDays / totalPossibleDays) * 100);
  };

  return {
    staff,
    loading,
    error: "",
    addStaffMember,
    updateStaffStatus,
    updateStaffInfo,
    getStaffMember,
    calculateAttendance,
    fetchStaffMembers: () => Promise.resolve(staff)
  };
};
