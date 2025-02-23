
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Clock, FileText, Star } from "lucide-react";
import type { StaffMember } from "@/types/staff";
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
        const [start, end] = time.split("-");
        const startHour = parseInt(start.split(":")[0]);
        const endHour = parseInt(end.split(":")[0]);
        return total + (endHour > startHour ? endHour - startHour : 24 - startHour + endHour);
      }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">Manage your team members and schedules</p>
        </div>
        <AddStaffDialog onAddStaff={onAddStaff} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-4 mb-4">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Staff List
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card className="p-6">
            <StaffList
              staff={staff}
              onUpdateStatus={onUpdateStatus}
              onSelectStaff={setSelectedStaffId}
              calculateAttendance={calculateAttendance}
            />
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card className="p-6">
            <ScheduleManager
              staff={staff}
              onAddShift={onAddShift}
              calculateWeeklyHours={calculateWeeklyHours}
              selectedStaffId={selectedStaffId}
            />
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Performance Reviews</h2>
                <Button variant="outline">Add Review</Button>
              </div>
              {selectedStaffId && (
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-4">
                      <h3 className="font-medium mb-2">Attendance Rate</h3>
                      <p className="text-2xl font-bold">{calculateAttendance(selectedStaffId)}%</p>
                    </Card>
                    <Card className="p-4">
                      <h3 className="font-medium mb-2">Weekly Hours</h3>
                      <p className="text-2xl font-bold">{calculateWeeklyHours(selectedStaffId)}h</p>
                    </Card>
                    <Card className="p-4">
                      <h3 className="font-medium mb-2">Performance Score</h3>
                      <p className="text-2xl font-bold">
                        {staff.find(m => m.id === selectedStaffId)?.performanceRating || 0}/10
                      </p>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Staff Documents</h2>
                <Button variant="outline">Upload Document</Button>
              </div>
              {selectedStaffId && (
                <div className="grid gap-4">
                  <p className="text-muted-foreground">Select a staff member to view their documents</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
