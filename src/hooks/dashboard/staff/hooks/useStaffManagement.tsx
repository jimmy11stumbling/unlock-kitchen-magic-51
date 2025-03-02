import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember, StaffStatus } from "@/types/staff";
import { toast } from "@/components/ui/use-toast";

export const useStaffManagement = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      
      // Instead of querying a non-existent table, we'll use mock data
      // In a real application, this would be a proper Supabase query
      const mockStaff: StaffMember[] = [
        {
          id: 1,
          name: "John Smith",
          role: "manager",
          email: "john@restaurant.com",
          phone: "555-1234",
          status: "active",
          salary: 60000,
          hireDate: "2020-01-15",
          schedule: {
            monday: "9:00-17:00",
            tuesday: "9:00-17:00",
            wednesday: "9:00-17:00",
            thursday: "9:00-17:00",
            friday: "9:00-17:00",
            saturday: "OFF",
            sunday: "OFF"
          }
        },
        // ... add more mock staff members as needed
      ];
      
      setStaff(mockStaff);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast({
        title: "Error",
        description: "Failed to fetch staff data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStaffById = async (id: number) => {
    try {
      // Mock implementation
      return staff.find(member => member.id === id) || null;
    } catch (error) {
      console.error("Error fetching staff member:", error);
      throw error;
    }
  };

  const addStaffMember = async (data: Omit<StaffMember, "id" | "status">) => {
    try {
      // Mock implementation
      const newMember: StaffMember = {
        ...data,
        id: staff.length + 1,
        status: "active",
      };
      
      setStaff([...staff, newMember]);
      return newMember;
    } catch (error) {
      console.error("Error adding staff member:", error);
      throw error;
    }
  };

  const updateStaffStatus = async (id: number, status: StaffStatus) => {
    try {
      // Mock implementation
      const updatedStaff = staff.map(member => 
        member.id === id ? { ...member, status } : member
      );
      setStaff(updatedStaff);
    } catch (error) {
      console.error("Error updating staff status:", error);
      throw error;
    }
  };

  return {
    staff,
    loading,
    getStaffById,
    addStaffMember,
    updateStaffStatus,
  };
};
