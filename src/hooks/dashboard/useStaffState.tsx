
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember, StaffStatus } from "@/types/staff";

export const useStaffState = () => {
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: 1,
      name: "John Smith",
      role: "manager",
      email: "john@restaurant.com",
      phone: "555-1234",
      status: "active",
      salary: 60000,
      hireDate: "2020-01-15",
      department: "Management",
      schedule: {
        monday: "9:00-17:00",
        tuesday: "9:00-17:00",
        wednesday: "9:00-17:00",
        thursday: "9:00-17:00",
        friday: "9:00-17:00",
        saturday: "OFF",
        sunday: "OFF"
      },
      shift: "AM",
      performanceRating: 4.8,
      certifications: ["Food Safety", "Management Training"]
    },
    {
      id: 2,
      name: "Emily Chen",
      role: "chef",
      email: "emily@restaurant.com",
      phone: "555-2345",
      status: "active",
      salary: 55000,
      hireDate: "2020-03-10",
      department: "Kitchen",
      schedule: {
        monday: "14:00-22:00",
        tuesday: "14:00-22:00",
        wednesday: "14:00-22:00",
        thursday: "OFF",
        friday: "14:00-22:00",
        saturday: "14:00-22:00",
        sunday: "OFF"
      },
      shift: "PM",
      performanceRating: 4.9,
      certifications: ["Culinary Arts", "Food Safety"]
    },
    {
      id: 3,
      name: "Miguel Rodriguez",
      role: "server",
      email: "miguel@restaurant.com",
      phone: "555-3456",
      status: "on_break",
      salary: 35000,
      hireDate: "2021-05-20",
      department: "Service",
      schedule: {
        monday: "OFF",
        tuesday: "16:00-24:00",
        wednesday: "16:00-24:00",
        thursday: "16:00-24:00",
        friday: "16:00-24:00",
        saturday: "16:00-24:00",
        sunday: "OFF"
      },
      shift: "PM",
      performanceRating: 4.5,
      certifications: ["Customer Service"]
    },
    {
      id: 4,
      name: "Sarah Johnson",
      role: "bartender",
      email: "sarah@restaurant.com",
      phone: "555-4567",
      status: "off_duty",
      salary: 40000,
      hireDate: "2021-02-15",
      department: "Bar",
      schedule: {
        monday: "OFF",
        tuesday: "OFF",
        wednesday: "16:00-24:00",
        thursday: "16:00-24:00",
        friday: "16:00-24:00",
        saturday: "16:00-24:00",
        sunday: "16:00-24:00"
      },
      shift: "PM",
      performanceRating: 4.7,
      certifications: ["Mixology", "Responsible Service"]
    }
  ]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Calculate weekly hours based on schedule
  const calculateWeeklyHours = (staffId: number): number => {
    const staffMember = staff.find(s => s.id === staffId);
    if (!staffMember?.schedule) return 0;
    
    // Calculate hours from the schedule
    return Object.entries(staffMember.schedule)
      .filter(([_, time]) => typeof time === 'string' && time !== "OFF")
      .reduce((total, [_, time]) => {
        if (typeof time !== 'string' || !time.includes("-")) return total;
        const [start, end] = time.split("-");
        const startHour = parseInt(start.split(":")[0]);
        const endHour = parseInt(end.split(":")[0]);
        return total + (endHour > startHour ? endHour - startHour : 24 - startHour + endHour);
      }, 0);
  };

  const addStaffMember = async (data: Omit<StaffMember, "id" | "status">) => {
    try {
      setLoading(true);
      
      // In a real application, this would call an API
      const newStaffMember: StaffMember = {
        ...data,
        id: staff.length + 1,
        status: "active",
      };
      
      setStaff([...staff, newStaffMember]);
      
      toast({
        title: "Staff member added",
        description: `${data.name} has been added to the team.`
      });
      
      return newStaffMember;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add staff member",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStaffStatus = async (staffId: number, status: StaffStatus) => {
    try {
      setLoading(true);
      
      // Update staff status locally
      const updatedStaff = staff.map(member => 
        member.id === staffId ? { ...member, status } : member
      );
      
      setStaff(updatedStaff);
      
      toast({
        title: "Status updated",
        description: `Staff member's status has been updated to ${status.replace('_', ' ')}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update staff status",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStaffInfo = async (staffId: number, updates: Partial<StaffMember>) => {
    try {
      setLoading(true);
      
      // Update staff info locally
      const updatedStaff = staff.map(member => 
        member.id === staffId ? { ...member, ...updates } : member
      );
      
      setStaff(updatedStaff);
      
      toast({
        title: "Information updated",
        description: "Staff member's information has been updated"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update staff information",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    staff,
    loading,
    addStaffMember,
    updateStaffStatus,
    updateStaffInfo,
    calculateWeeklyHours
  };
};
