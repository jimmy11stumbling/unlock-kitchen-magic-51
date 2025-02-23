
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { StaffMember, Shift } from "@/types/staff";

const initialStaff: StaffMember[] = [
  {
    id: 1,
    name: "Isabella Martinez",
    role: "Head Chef",
    status: "active",
    shift: "Evening",
    salary: "75000/year",
    email: "isabella.martinez@maestroai.com",
    phone: "(555) 123-4567",
    address: "789 Culinary Lane, Foodville, FC 12345",
    emergencyContact: {
      name: "Marco Martinez",
      phone: "(555) 987-6543",
      relationship: "Spouse"
    },
    startDate: "2022-03-15",
    department: "Kitchen",
    certifications: ["Master Chef", "Food Safety", "Wine Expert"],
    performanceRating: 4.8,
    notes: "Award-winning chef with 15 years of experience",
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
      accountNumber: "****4321",
      routingNumber: "****8765",
      accountType: "checking"
    }
  },
  {
    id: 2,
    name: "James Wilson",
    role: "Sous Chef",
    status: "active",
    shift: "Morning",
    salary: "58000/year",
    email: "james.wilson@maestroai.com",
    phone: "(555) 234-5678",
    address: "456 Kitchen Ave, Foodville, FC 12345",
    emergencyContact: {
      name: "Sarah Wilson",
      phone: "(555) 876-5432",
      relationship: "Sister"
    },
    startDate: "2022-06-01",
    department: "Kitchen",
    certifications: ["Culinary Arts", "Food Safety"],
    performanceRating: 4.5,
    notes: "Specialized in French cuisine",
    schedule: {
      monday: "06:00-14:00",
      tuesday: "06:00-14:00",
      wednesday: "06:00-14:00",
      thursday: "06:00-14:00",
      friday: "OFF",
      saturday: "OFF",
      sunday: "06:00-14:00"
    },
    bankInfo: {
      accountNumber: "****5678",
      routingNumber: "****4321",
      accountType: "checking"
    }
  },
  {
    id: 3,
    name: "Sofia Chen",
    role: "Server",
    status: "active",
    shift: "Evening",
    salary: "45000/year",
    email: "sofia.chen@maestroai.com",
    phone: "(555) 345-6789",
    address: "123 Service St, Foodville, FC 12345",
    emergencyContact: {
      name: "Li Chen",
      phone: "(555) 765-4321",
      relationship: "Mother"
    },
    startDate: "2023-01-15",
    department: "Service",
    certifications: ["Wine Service", "Food Handler"],
    performanceRating: 4.7,
    notes: "Excellent customer service skills, fluent in 3 languages",
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
      accountNumber: "****8901",
      routingNumber: "****2345",
      accountType: "savings"
    }
  },
  {
    id: 4,
    name: "Alex Thompson",
    role: "Bartender",
    status: "active",
    shift: "Evening",
    salary: "52000/year",
    email: "alex.thompson@maestroai.com",
    phone: "(555) 456-7890",
    address: "321 Bar Lane, Foodville, FC 12345",
    emergencyContact: {
      name: "Chris Thompson",
      phone: "(555) 654-3210",
      relationship: "Brother"
    },
    startDate: "2022-09-01",
    department: "Bar",
    certifications: ["Mixology", "Food Safety", "Wine Expert"],
    performanceRating: 4.6,
    notes: "Specialist in craft cocktails",
    schedule: {
      monday: "16:00-24:00",
      tuesday: "16:00-24:00",
      wednesday: "16:00-24:00",
      thursday: "OFF",
      friday: "16:00-24:00",
      saturday: "16:00-24:00",
      sunday: "OFF"
    },
    bankInfo: {
      accountNumber: "****2345",
      routingNumber: "****6789",
      accountType: "checking"
    }
  },
  {
    id: 5,
    name: "Maria Garcia",
    role: "Host",
    status: "active",
    shift: "Evening",
    salary: "38000/year",
    email: "maria.garcia@maestroai.com",
    phone: "(555) 567-8901",
    address: "567 Welcome Dr, Foodville, FC 12345",
    emergencyContact: {
      name: "Jose Garcia",
      phone: "(555) 543-2109",
      relationship: "Father"
    },
    startDate: "2023-03-01",
    department: "Service",
    certifications: ["Customer Service"],
    performanceRating: 4.4,
    notes: "Great at managing busy nights",
    schedule: {
      monday: "15:00-23:00",
      tuesday: "15:00-23:00",
      wednesday: "15:00-23:00",
      thursday: "15:00-23:00",
      friday: "OFF",
      saturday: "OFF",
      sunday: "15:00-23:00"
    },
    bankInfo: {
      accountNumber: "****3456",
      routingNumber: "****7890",
      accountType: "checking"
    }
  }
];

const initialShifts: Shift[] = [
  {
    id: 1,
    staffId: 1,
    date: new Date().toISOString().split('T')[0],
    time: "14:00-22:00"
  },
  {
    id: 2,
    staffId: 2,
    date: new Date().toISOString().split('T')[0],
    time: "06:00-14:00"
  },
  {
    id: 3,
    staffId: 3,
    date: new Date().toISOString().split('T')[0],
    time: "16:00-24:00"
  },
  {
    id: 4,
    staffId: 4,
    date: new Date().toISOString().split('T')[0],
    time: "16:00-24:00"
  },
  {
    id: 5,
    staffId: 5,
    date: new Date().toISOString().split('T')[0],
    time: "15:00-23:00"
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
