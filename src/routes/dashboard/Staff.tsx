
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { StaffPanel } from "@/components/dashboard/StaffPanel";
import { useStaffBasic } from "@/hooks/dashboard/staff/useStaffBasic";
import type { StaffMember } from "@/types/staff";

const Staff = () => {
  const { 
    staff, 
    loading, 
    addStaffMember, 
    updateStaffStatus, 
    updateStaffInfo 
  } = useStaffBasic();
  const { toast } = useToast();

  const handleAddStaff = async (data: Omit<StaffMember, "id" | "status">) => {
    try {
      const newStaffMember = await addStaffMember(data);
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
    }
  };

  const handleUpdateStatus = async (staffId: number, newStatus: StaffMember["status"]) => {
    try {
      await updateStaffStatus(staffId, newStatus);
      toast({
        title: "Status updated",
        description: `Staff member's status has been updated to ${newStatus.replace('_', ' ')}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update staff status",
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleUpdateInfo = async (staffId: number, updates: Partial<StaffMember>) => {
    try {
      await updateStaffInfo(staffId, updates);
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
    }
  };

  const handleAddShift = (staffId: number, date: string, time: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    if (!staffMember) return;

    // Fix: Convert the date string to a Date object, get the day name, and convert to lowercase
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

  return <StaffPanel 
    staff={staff}
    onAddStaff={handleAddStaff}
    onUpdateStatus={handleUpdateStatus}
    onAddShift={handleAddShift}
    onUpdateInfo={handleUpdateInfo}
  />;
};

export default Staff;
