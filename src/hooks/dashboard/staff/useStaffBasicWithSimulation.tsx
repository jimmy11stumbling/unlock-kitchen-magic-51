import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { StaffMember } from "@/types/staff";
import { useSimulationData } from "@/hooks/useSimulationData";

export const useStaffBasicWithSimulation = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isInitialized, getData } = useSimulationData();

  // Load simulation data when the hook mounts
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        // Check if simulation data is available
        if (isInitialized) {
          const simData = getData();
          const initialStaff = (simData && simData.staff) ? simData.staff : [];
          setStaff(initialStaff);
        } else {
          // Fallback to default staff if simulation is not initialized
          // (This would be API call in a real app)
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        }
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
  }, [toast, isInitialized, getData]);

  const addStaffMember = async (data: Omit<StaffMember, "id" | "status">) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newStaffMember: StaffMember = {
        ...data,
        id: Math.max(0, ...staff.map(s => s.id)) + 1,
        status: "active",
      };
      
      const updatedStaff = [...staff, newStaffMember];
      setStaff(updatedStaff);
      
      // Update simulation data if initialized
      if (isInitialized) {
        const simData = getData();
        if (simData && simData.staff) {
          const updatedStaff = [...simData.staff, newStaffMember];
          simData.staff = updatedStaff;
          localStorage.setItem('simulationData', JSON.stringify(simData));
        }
      }
      
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
      
      const updatedStaff = staff.map(member => 
        member.id === staffId ? { ...member, status: newStatus } : member
      );
      
      setStaff(updatedStaff);
      
      // Update simulation data if initialized
      if (isInitialized) {
        const simData = getData();
        if (simData && simData.staff) {
          const updatedStaff = [...simData.staff];
          updatedStaff.forEach(member => {
            if (member.id === staffId) {
              member.status = newStatus;
            }
          });
          simData.staff = updatedStaff;
          localStorage.setItem('simulationData', JSON.stringify(simData));
        }
      }
      
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
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateStaffInfo = async (staffId: number, updates: Partial<StaffMember>) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedStaff = staff.map(member => 
        member.id === staffId ? { ...member, ...updates } : member
      );
      
      setStaff(updatedStaff);
      
      // Update simulation data if initialized
      if (isInitialized) {
        const simData = getData();
        if (simData && simData.staff) {
          const updatedStaff = [...simData.staff];
          updatedStaff.forEach(member => {
            if (member.id === staffId) {
              Object.assign(member, updates);
            }
          });
          simData.staff = updatedStaff;
          localStorage.setItem('simulationData', JSON.stringify(simData));
        }
      }
      
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
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteStaffMember = async (staffId: number) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedStaff = staff.filter(member => member.id !== staffId);
      setStaff(updatedStaff);
      
      // Update simulation data if initialized
      if (isInitialized) {
        const simData = getData();
        if (simData && simData.staff) {
          const updatedStaff = [...simData.staff];
          updatedStaff.forEach(member => {
            if (member.id === staffId) {
              updatedStaff.splice(updatedStaff.indexOf(member), 1);
            }
          });
          simData.staff = updatedStaff;
          localStorage.setItem('simulationData', JSON.stringify(simData));
        }
      }
      
      toast({
        title: "Staff Removed",
        description: "Staff member has been removed from the system",
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting staff member:", error);
      toast({
        title: "Error",
        description: "Failed to delete staff member",
        variant: "destructive",
      });
      return false;
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
    deleteStaffMember
  };
};
