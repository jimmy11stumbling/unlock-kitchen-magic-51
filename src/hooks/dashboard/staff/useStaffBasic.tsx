
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { StaffMember } from "@/types/staff";

export const useStaffBasic = (initialStaff: StaffMember[]) => {
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);

  const addStaffMember = (data: Omit<StaffMember, "id" | "status">) => {
    const newStaffMember: StaffMember = {
      id: staff.length + 1,
      status: "off_duty",
      ...data,
    };
    setStaff([...staff, newStaffMember]);
    toast({
      title: "Staff member added",
      description: `${data.name} has been added to the staff list.`,
    });
  };

  const updateStaffStatus = (staffId: number, newStatus: StaffMember["status"]) => {
    setStaff(staff.map(member => 
      member.id === staffId ? { ...member, status: newStatus } : member
    ));
    const member = staff.find(m => m.id === staffId);
    toast({
      title: "Status updated",
      description: `${member?.name}'s status has been updated to ${newStatus.replace("_", " ")}.`,
    });
  };

  const updateStaffInfo = (staffId: number, updates: Partial<StaffMember>) => {
    setStaff(staff.map(member =>
      member.id === staffId ? { ...member, ...updates } : member
    ));
    toast({
      title: "Staff info updated",
      description: "Staff member information has been updated successfully.",
    });
  };

  return {
    staff,
    addStaffMember,
    updateStaffStatus,
    updateStaffInfo,
  };
};
