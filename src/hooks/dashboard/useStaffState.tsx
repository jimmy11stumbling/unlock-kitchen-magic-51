
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
    salary: "15.00/hr",
    email: "john.smith@restaurant.com",
    phone: "(555) 123-4567",
    address: "123 Server Lane, Restaurant City, RC 12345",
    emergencyContact: {
      name: "Jane Smith",
      phone: "(555) 987-6543",
      relationship: "Spouse"
    },
    startDate: "2023-01-15",
    department: "Service",
    certifications: ["Food Handler", "Wine Service"],
    performanceRating: 4.5,
    notes: "Excellent customer service skills",
    schedule: {
      monday: "9:00-17:00",
      tuesday: "9:00-17:00",
      wednesday: "OFF",
      thursday: "9:00-17:00",
      friday: "9:00-17:00",
      saturday: "OFF",
      sunday: "12:00-20:00"
    },
    bankInfo: {
      accountNumber: "****1234",
      routingNumber: "****5678",
      accountType: "checking"
    }
  },
  // ... More staff members with similar detailed information
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

  const updateStaffSchedule = (staffId: number, schedule: StaffMember["schedule"]) => {
    setStaff(staff.map(member =>
      member.id === staffId ? { ...member, schedule } : member
    ));
    toast({
      title: "Schedule updated",
      description: "Staff member's schedule has been updated.",
    });
  };

  const updateStaffPerformance = (staffId: number, rating: number, notes: string) => {
    setStaff(staff.map(member =>
      member.id === staffId ? { ...member, performanceRating: rating, notes } : member
    ));
    toast({
      title: "Performance updated",
      description: "Staff member's performance review has been updated.",
    });
  };

  return {
    staff,
    shifts,
    addStaffMember,
    updateStaffStatus,
    addShift,
    updateStaffInfo,
    updateStaffSchedule,
    updateStaffPerformance,
  };
};
