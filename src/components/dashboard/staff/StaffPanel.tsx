import { useState } from 'react';
import { StaffList } from './StaffList';
import { ScheduleManager } from './ScheduleManager';
import { PayrollPanel } from './PayrollPanel';
import { AddStaffDialog } from './AddStaffDialog';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar, DollarSign } from "lucide-react";
import type { StaffMember } from '@/types';

export const StaffPanel = () => {
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: 1,
      name: "John Doe",
      role: "manager",
      status: "active",
      salary: 60000,
      shift: "Morning",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      address: "123 Main St",
      emergencyContact: {
        name: "Jane Doe",
        phone: "987-654-3210",
        relationship: "Spouse"
      },
      startDate: "2022-01-01",
      department: "Management",
      certifications: ["ServSafe Manager"],
      performanceRating: 4,
      notes: "Excellent manager",
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
        accountNumber: "1234567890",
        routingNumber: "021000021",
        accountType: "checking"
      }
    },
    {
      id: 2,
      name: "Alice Smith",
      role: "chef",
      status: "active",
      salary: 50000,
      shift: "Evening",
      email: "alice.smith@example.com",
      phone: "456-789-0123",
      address: "456 Elm St",
      emergencyContact: {
        name: "Bob Smith",
        phone: "321-098-7654",
        relationship: "Spouse"
      },
      startDate: "2022-03-15",
      department: "Kitchen",
      certifications: ["Certified Chef"],
      performanceRating: 5,
      notes: "Exceptional culinary skills",
      schedule: {
        monday: "15:00-23:00",
        tuesday: "15:00-23:00",
        wednesday: "15:00-23:00",
        thursday: "OFF",
        friday: "15:00-23:00",
        saturday: "15:00-23:00",
        sunday: "OFF"
      },
      bankInfo: {
        accountNumber: "0987654321",
        routingNumber: "121000248",
        accountType: "savings"
      }
    },
    {
      id: 3,
      name: "Bob Johnson",
      role: "server",
      status: "on_break",
      salary: 30000,
      shift: "Morning",
      email: "bob.johnson@example.com",
      phone: "789-012-3456",
      address: "789 Oak St",
      emergencyContact: {
        name: "Carol Johnson",
        phone: "654-321-0987",
        relationship: "Spouse"
      },
      startDate: "2022-05-01",
      department: "Service",
      certifications: ["Alcohol Service"],
      performanceRating: 3,
      notes: "Reliable server",
      schedule: {
        monday: "OFF",
        tuesday: "9:00-15:00",
        wednesday: "9:00-15:00",
        thursday: "9:00-15:00",
        friday: "OFF",
        saturday: "9:00-15:00",
        sunday: "9:00-15:00"
      },
      bankInfo: {
        accountNumber: "5432167890",
        routingNumber: "071000013",
        accountType: "checking"
      }
    },
    {
      id: 4,
      name: "Eve Williams",
      role: "host",
      status: "off_duty",
      salary: 25000,
      shift: "Evening",
      email: "eve.williams@example.com",
      phone: "012-345-6789",
      address: "012 Pine St",
      emergencyContact: {
        name: "David Williams",
        phone: "789-654-3210",
        relationship: "Spouse"
      },
      startDate: "2022-07-01",
      department: "Service",
      certifications: [],
      performanceRating: 4,
      notes: "Friendly and efficient host",
      schedule: {
        monday: "17:00-23:00",
        tuesday: "OFF",
        wednesday: "17:00-23:00",
        thursday: "17:00-23:00",
        friday: "OFF",
        saturday: "17:00-23:00",
        sunday: "17:00-23:00"
      },
      bankInfo: {
        accountNumber: "6789054321",
        routingNumber: "031100061",
        accountType: "checking"
      }
    },
    {
      id: 5,
      name: "Charlie Brown",
      role: "bartender",
      status: "active",
      salary: 35000,
      shift: "Evening",
      email: "charlie.brown@example.com",
      phone: "345-678-9012",
      address: "345 Cedar St",
      emergencyContact: {
        name: "Lucy Brown",
        phone: "210-987-6543",
        relationship: "Sibling"
      },
      startDate: "2022-09-01",
      department: "Bar",
      certifications: ["Bartending Certification"],
      performanceRating: 5,
      notes: "Creative and skilled bartender",
      schedule: {
        monday: "OFF",
        tuesday: "18:00-02:00",
        wednesday: "OFF",
        thursday: "18:00-02:00",
        friday: "18:00-02:00",
        saturday: "18:00-02:00",
        sunday: "OFF"
      },
      bankInfo: {
        accountNumber: "4321098765",
        routingNumber: "121301381",
        accountType: "checking"
      }
    }
  ]);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);

  const handleAddStaff = (staffData: Omit<StaffMember, "id" | "status">) => {
    const newStaffMember: StaffMember = {
      id: staff.length + 1,
      ...staffData,
      status: "active",
    };
    setStaff([...staff, newStaffMember]);
  };

  const handleUpdateStaffStatus = (staffId: number, newStatus: StaffMember["status"]) => {
    setStaff(staff.map(staffMember =>
      staffMember.id === staffId ? { ...staffMember, status: newStatus } : staffMember
    ));
  };

  const handleUpdateStaffInfo = (staffId: number, updates: Partial<StaffMember>) => {
    setStaff(staff.map(staffMember =>
      staffMember.id === staffId ? { ...staffMember, ...updates } : staffMember
    ));
  };

  const handleAddShift = (staffId: number, date: string, time: string) => {
    setStaff(staff.map(staffMember => {
      if (staffMember.id === staffId) {
        return {
          ...staffMember,
          schedule: {
            ...staffMember.schedule,
            [date]: time
          }
        };
      }
      return staffMember;
    }));
  };

  const calculateWeeklyHours = (schedule: StaffMember['schedule']) => {
    if (!schedule) return 0;

    return Object.values(schedule)
      .filter(time => time !== "OFF")
      .reduce((total, time) => {
        const [start, end] = time.toString().split("-");
        if (!start || !end) return total;
        
        const startHour = parseInt(start.split(":")[0]);
        const endHour = parseInt(end.split(":")[0]);
        return total + (endHour > startHour ? endHour - startHour : 24 - startHour + endHour);
      }, 0);
  };

  const handleGeneratePayroll = async (staffId: number, startDate: string, endDate: string) => {
    console.log(`Generating payroll for staff ${staffId} from ${startDate} to ${endDate}`);
  };

  const handleGeneratePayStub = async (payrollEntryId: number) => {
    console.log(`Generating pay stub for payroll entry ${payrollEntryId}`);
    return 'url_to_paystub_document';
  };

  const handleUpdatePayrollSettings = async (staffId: number, settings: StaffMember['payrollSettings']) => {
    console.log(`Updating payroll settings for staff ${staffId} with settings:`, settings);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="staff-list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="staff-list" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Staff List
          </TabsTrigger>
          <TabsTrigger value="schedule-manager" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="payroll-panel" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Payroll
          </TabsTrigger>
        </TabsList>

        <TabsContent value="staff-list">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Staff Management</h2>
            <AddStaffDialog onAddStaff={handleAddStaff} />
          </div>
          <StaffList
            staff={staff}
            onUpdateStatus={handleUpdateStaffStatus}
            onSelectStaff={setSelectedStaffId}
            calculateAttendance={() => 80}
          />
        </TabsContent>

        <TabsContent value="schedule-manager">
          <ScheduleManager
            staff={staff}
            onAddShift={handleAddShift}
            selectedStaffId={selectedStaffId}
            calculateWeeklyHours={calculateWeeklyHours}
            onUpdateStaffInfo={handleUpdateStaffInfo}
          />
        </TabsContent>

        <TabsContent value="payroll-panel">
          <PayrollPanel
            staff={staff}
            onGeneratePayroll={handleGeneratePayroll}
            onGeneratePayStub={handleGeneratePayStub}
            onUpdatePayrollSettings={handleUpdatePayrollSettings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
