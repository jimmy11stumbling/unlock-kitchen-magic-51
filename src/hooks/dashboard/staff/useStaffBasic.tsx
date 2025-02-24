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

// Initial staff data for testing
const initialStaffData: StaffMember[] = [
  {
    id: 1,
    name: "John Smith",
    role: "manager",
    status: "active",
    shift: "Morning",
    salary: 65000,
    hourlyRate: 31.25,
    overtimeRate: 46.88,
    email: "john.smith@restaurant.com",
    phone: "555-0101",
    address: "123 Main St",
    emergencyContact: {
      name: "Jane Smith",
      phone: "555-0102",
      relationship: "spouse"
    },
    startDate: "2023-01-15",
    department: "management",
    certifications: ["ServSafe Manager", "Food Handler", "Alcohol Service"],
    performanceRating: 4.8,
    notes: "Regional manager for downtown locations",
    schedule: {
      monday: "9:00-17:00",
      tuesday: "9:00-17:00",
      wednesday: "9:00-17:00",
      thursday: "9:00-17:00",
      friday: "9:00-17:00",
      saturday: "OFF",
      sunday: "OFF"
    },
    bankInfo: {
      accountNumber: "****1234",
      routingNumber: "****5678",
      accountType: "checking"
    }
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    role: "chef",
    status: "active",
    shift: "Evening",
    salary: 55000,
    hourlyRate: 26.44,
    overtimeRate: 39.66,
    email: "maria.r@restaurant.com",
    phone: "555-0103",
    address: "456 Oak Ave",
    emergencyContact: {
      name: "Carlos Rodriguez",
      phone: "555-0104",
      relationship: "brother"
    },
    startDate: "2023-02-01",
    department: "kitchen",
    certifications: ["Culinary Arts Degree", "Food Safety", "Kitchen Management"],
    performanceRating: 4.9,
    notes: "Head chef for fine dining section",
    schedule: {
      monday: "14:00-22:00",
      tuesday: "14:00-22:00",
      wednesday: "14:00-22:00",
      thursday: "OFF",
      friday: "14:00-22:00",
      saturday: "14:00-22:00",
      sunday: "OFF"
    },
    bankInfo: {
      accountNumber: "****5678",
      routingNumber: "****9012",
      accountType: "checking"
    }
  },
  {
    id: 3,
    name: "David Chen",
    role: "server",
    status: "active",
    shift: "Evening",
    salary: 35000,
    hourlyRate: 16.83,
    overtimeRate: 25.25,
    email: "david.c@restaurant.com",
    phone: "555-0105",
    address: "789 Pine St",
    emergencyContact: {
      name: "Lisa Chen",
      phone: "555-0106",
      relationship: "sister"
    },
    startDate: "2023-03-15",
    department: "service",
    certifications: ["Food Handler", "Wine Service", "Customer Service"],
    performanceRating: 4.7,
    notes: "Senior server with wine expertise",
    schedule: {
      monday: "16:00-24:00",
      tuesday: "16:00-24:00",
      wednesday: "OFF",
      thursday: "16:00-24:00",
      friday: "16:00-24:00",
      saturday: "16:00-24:00",
      sunday: "OFF"
    },
    bankInfo: {
      accountNumber: "****9012",
      routingNumber: "****3456",
      accountType: "savings"
    }
  },
  {
    id: 4,
    name: "Sarah Johnson",
    role: "bartender",
    status: "active",
    shift: "Evening",
    salary: 40000,
    hourlyRate: 19.23,
    overtimeRate: 28.85,
    email: "sarah.j@restaurant.com",
    phone: "555-0107",
    address: "321 Elm St",
    emergencyContact: {
      name: "Mike Johnson",
      phone: "555-0108",
      relationship: "father"
    },
    startDate: "2023-04-01",
    department: "bar",
    certifications: ["Mixology", "Alcohol Service", "Food Handler"],
    performanceRating: 4.6,
    notes: "Specialty cocktail expert",
    schedule: {
      monday: "OFF",
      tuesday: "16:00-24:00",
      wednesday: "16:00-24:00",
      thursday: "16:00-24:00",
      friday: "16:00-24:00",
      saturday: "16:00-24:00",
      sunday: "OFF"
    },
    bankInfo: {
      accountNumber: "****3456",
      routingNumber: "****7890",
      accountType: "checking"
    }
  },
  {
    id: 5,
    name: "Michael Brown",
    role: "host",
    status: "active",
    shift: "Morning",
    salary: 32000,
    hourlyRate: 15.38,
    overtimeRate: 23.07,
    email: "michael.b@restaurant.com",
    phone: "555-0109",
    address: "654 Maple Dr",
    emergencyContact: {
      name: "Emily Brown",
      phone: "555-0110",
      relationship: "spouse"
    },
    startDate: "2023-05-01",
    department: "service",
    certifications: ["Customer Service", "Reservation Management"],
    performanceRating: 4.5,
    notes: "Excellent at handling large party reservations",
    schedule: {
      monday: "10:00-18:00",
      tuesday: "10:00-18:00",
      wednesday: "10:00-18:00",
      thursday: "10:00-18:00",
      friday: "OFF",
      saturday: "10:00-18:00",
      sunday: "OFF"
    },
    bankInfo: {
      accountNumber: "****7890",
      routingNumber: "****1234",
      accountType: "checking"
    }
  }
];

export const useStaffBasic = () => {
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>(initialStaffData);
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
