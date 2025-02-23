
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { StaffMember } from "@/types/staff";

export const usePerformanceManagement = (staff: StaffMember[], setStaff: (staff: StaffMember[]) => void) => {
  const { toast } = useToast();

  const updateStaffPerformance = (staffId: number, rating: number, notes: string) => {
    setStaff(staff.map(member =>
      member.id === staffId ? { ...member, performanceRating: rating, notes } : member
    ));
    toast({
      title: "Performance updated",
      description: "Staff member's performance review has been updated.",
    });
  };

  const updateStaffSchedule = (staffId: number, schedule: StaffMember["schedule"]) => {
    setStaff(staff.map(member =>
      member.id === staffId ? { ...member, schedule } : member
    ));
    toast({
      title: "Schedule updated",
      description: "Staff member's schedule has been updated.",
    });
  };

  return {
    updateStaffPerformance,
    updateStaffSchedule,
  };
};
