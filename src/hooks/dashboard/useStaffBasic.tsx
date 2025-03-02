import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { StaffMember } from "@/types/staff";

// Mock data for initial staff list
const initialStaff: StaffMember[] = [
  {
    id: 1,
    name: "John Doe",
    role: "manager",
    email: "john.doe@restaurant.com",
    phone: "555-123-4567",
    status: "active",
    salary: 65000,
    hireDate: "2020-01-15", // Add hireDate
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
  {
    id: 2,
    name: "Jane Smith",
    role: "chef",
    email: "jane.smith@restaurant.com",
    phone: "555-987-6543",
    status: "active",
    salary: 55000,
    hireDate: "2021-03-10", // Add hireDate
    schedule: {
      monday: "14:00-22:00",
      tuesday: "14:00-22:00",
      wednesday: "OFF",
      thursday: "14:00-22:00",
      friday: "14:00-22:00",
      saturday: "14:00-22:00",
      sunday: "OFF"
    },
    certifications: ["Culinary Arts", "Food Safety"],
    performanceRating: 8,
    notes: "Head chef specializing in Italian cuisine",
    department: "kitchen",
  },
  {
    id: 3,
    name: "David Johnson",
    role: "server",
    email: "david.j@restaurant.com",
    phone: "555-456-7890",
    status: "on_break",
    salary: 35000,
    hireDate: "2022-05-20", // Add hireDate
    schedule: {
      monday: "OFF",
      tuesday: "16:00-24:00",
      wednesday: "16:00-24:00",
      thursday: "16:00-24:00",
      friday: "16:00-24:00",
      saturday: "16:00-24:00",
      sunday: "OFF"
    },
    certifications: ["Customer Service"],
    performanceRating: 7,
    notes: "Server with 3 years of experience",
    department: "service",
  },
  {
    id: 4,
    name: "Maria Garcia",
    role: "bartender",
    email: "maria.g@restaurant.com",
    phone: "555-789-0123",
    status: "active",
    salary: 42000,
    hireDate: "2021-11-15", // Add hireDate
    schedule: {
      monday: "16:00-24:00",
      tuesday: "16:00-24:00",
      wednesday: "16:00-24:00",
      thursday: "OFF",
      friday: "16:00-24:00",
      saturday: "16:00-24:00",
      sunday: "OFF"
    },
    certifications: ["Mixology", "Beverage Management"],
    performanceRating: 9,
    notes: "Experienced bartender with creative cocktail skills",
    department: "bar",
  },
  {
    id: 5,
    name: "Sam Wilson",
    role: "host",
    email: "sam.w@restaurant.com",
    phone: "555-234-5678",
    status: "off_duty",
    salary: 32000,
    hireDate: "2022-10-05", // Add hireDate
    schedule: {
      monday: "15:00-23:00",
      tuesday: "15:00-23:00",
      wednesday: "15:00-23:00",
      thursday: "15:00-23:00",
      friday: "OFF",
      saturday: "15:00-23:00",
      sunday: "OFF"
    },
    certifications: ["Customer Service"],
    performanceRating: 8,
    notes: "Host with excellent customer service skills",
    department: "service",
  }
];

export const useStaffBasic = () => {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Simulate loading staff data when the hook mounts
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        // In a real app, this would be a fetch from API
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        // Data is already in initialStaff so no need to set it again here
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

    fetchStaff();
  }, [toast]);

  const addStaffMember = async (data: Omit<StaffMember, "id" | "status">) => {
    setLoading(true);
    try {
      // Simulate API call
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
    } finally {
      setLoading(false);
    }
  };

  const updateStaffStatus = async (staffId: number, newStatus: StaffMember["status"]) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setStaff(staff.map(member => 
        member.id === staffId ? { ...member, status: newStatus } : member
      ));
      
      toast({
        title: "Status Updated",
        description: `Staff member's status has been updated to ${newStatus.replace('_', ' ')}`,
      });
    } catch (error) {
      console.error("Error updating staff status:", error);
      toast({
        title: "Error",
        description: "Failed to update staff status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStaffInfo = async (staffId: number, updates: Partial<StaffMember>) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStaff(staff.map(member => 
        member.id === staffId ? { ...member, ...updates } : member
      ));
      
      toast({
        title: "Information Updated",
        description: "Staff member's information has been updated",
      });
    } catch (error) {
      console.error("Error updating staff info:", error);
      toast({
        title: "Error",
        description: "Failed to update staff information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddShift = (staffId: number, date: string, time: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    if (!staffMember) return;

    // Create a proper day name from the date
    const dateObj = new Date(date);
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = dayNames[dateObj.getDay()];
    
    updateStaffInfo(staffId, {
      schedule: {
        ...staffMember.schedule,
        [dayOfWeek]: time
      }
    });

    toast({
      title: "Shift added",
      description: `Shift has been added for ${staffMember.name} on ${date}`
    });
  };

  return {
    staff,
    loading,
    addStaffMember,
    updateStaffStatus,
    updateStaffInfo,
    handleAddShift
  };
};
