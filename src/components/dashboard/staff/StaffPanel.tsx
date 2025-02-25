import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Clock, FileText, Star } from "lucide-react";
import type { StaffMember } from "@/types";
import { AddStaffDialog } from "./staff/AddStaffDialog";
import { StaffList } from "./staff/StaffList";
import { ScheduleManager } from "./staff/ScheduleManager";
import { Button } from "@/components/ui/button";

interface StaffPanelProps {
  staff: StaffMember[];
  onAddStaff: (data: Omit<StaffMember, "id" | "status">) => void;
  onUpdateStatus: (staffId: number, status: StaffMember["status"]) => void;
  onAddShift: (staffId: number, date: string, time: string) => void;
  onUpdateInfo: (staffId: number, updates: Partial<StaffMember>) => void;
}

export const StaffPanel = ({
  staff,
  onAddStaff,
  onUpdateStatus,
  onAddShift,
  onUpdateInfo,
}: StaffPanelProps) => {
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("list");

  const calculateAttendance = (staffId: number): number => {
    const member = staff.find(m => m.id === staffId);
    if (!member) return 0;

    const scheduledDays = Object.values(member.schedule).filter(day => day !== "OFF").length;
    const totalPossibleDays = 7;
    
    return Math.round((scheduledDays / totalPossibleDays) * 100);
  };

  const calculateWeeklyHours = (staffId: number): number => {
    const member = staff.find(m => m.id === staffId);
    if (!member?.schedule) return 0;

    return Object.values(member.schedule)
      .filter(time => time !== "OFF")
      .reduce((total, time) => {
        if (!time) return total;
        const [start, end] = time.split("-");
        if (!start || !end) return total;
        const startHour = parseInt(start.split(":")[0]);
        const endHour = parseInt(end.split(":")[0]);
        return total + (endHour > startHour ? endHour - startHour : 24 - startHour + endHour);
      }, 0);
  };

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
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Staff List
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="payroll" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Payroll
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Staff Management</h2>
            <AddStaffDialog onAddStaff={handleAddStaff} />
          </div>
          <StaffList
            staff={staff}
            onUpdateStatus={handleUpdateStaffStatus}
            onSelectStaff={setSelectedStaffId}
            calculateAttendance={calculateAttendance}
          />
        </TabsContent>

        <TabsContent value="schedule">
          <ScheduleManager
            staff={staff}
            onAddShift={handleAddShift}
            selectedStaffId={selectedStaffId}
            calculateWeeklyHours={calculateWeeklyHours}
            onUpdateStaffInfo={handleUpdateStaffInfo}
          />
        </TabsContent>

        <TabsContent value="payroll">
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
