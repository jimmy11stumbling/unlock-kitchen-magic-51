import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { StaffMember, Shift } from "@/types/staff";

const initialStaff: StaffMember[] = [
  {
    id: 1,
    name: "John Smith",
    role: "Server",
    status: "active",
    shift: "Morning",
    salary: "15.00/hr"
  },
  {
    id: 2,
    name: "Maria Garcia",
    role: "Chef",
    status: "active",
    shift: "Evening",
    salary: "25.00/hr"
  },
  {
    id: 3,
    name: "David Lee",
    role: "Host",
    status: "off_duty",
    shift: "Morning",
    salary: "14.00/hr"
  },
  {
    id: 4,
    name: "Sarah Johnson",
    role: "Bartender",
    status: "active",
    shift: "Evening",
    salary: "18.00/hr"
  }
];

const initialShifts: Shift[] = [
  {
    id: 1,
    staffId: 1,
    date: new Date().toISOString().split('T')[0],
    time: "9:00-17:00"
  },
  {
    id: 2,
    staffId: 2,
    date: new Date().toISOString().split('T')[0],
    time: "16:00-24:00"
  }
];

export const useStaffState = () => {
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);

  const addStaffMember = (data: { name: string; role: string; salary: string }) => {
    const newStaffMember: StaffMember = {
      id: staff.length + 1,
      name: data.name,
      role: data.role,
      status: "off_duty",
      shift: "Morning",
      salary: data.salary,
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

  const addShift = (staffId: number, date: string, time: string) => {
    const newShift: Shift = {
      id: shifts.length + 1,
      staffId,
      date,
      time,
    };
    
    const hasOverlap = shifts.some(
      shift => shift.staffId === staffId && shift.date === date && shift.time === time
    );

    if (hasOverlap) {
      toast({
        title: "Schedule conflict",
        description: "This staff member already has a shift during this time.",
        variant: "destructive",
      });
      return;
    }

    setShifts([...shifts, newShift]);
    const member = staff.find(m => m.id === staffId);
    toast({
      title: "Shift added",
      description: `New shift added for ${member?.name} on ${date}.`,
    });
  };

  return {
    staff,
    shifts,
    addStaffMember,
    updateStaffStatus,
    addShift,
  };
};
