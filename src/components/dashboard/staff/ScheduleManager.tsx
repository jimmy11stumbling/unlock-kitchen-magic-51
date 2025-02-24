
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { StaffMember } from "@/types/staff";
import { AddShiftForm } from "./schedule/AddShiftForm";
import { WeeklySchedule } from "./schedule/WeeklySchedule";
import { PersonalInfoForm } from "./schedule/PersonalInfoForm";
import { UserPlus, Info, DollarSign, GraduationCap, FileText } from "lucide-react";

interface ScheduleManagerProps {
  staff: StaffMember[];
  onAddShift: (staffId: number, date: string, time: string) => void;
  calculateWeeklyHours: (staffId: number) => number;
  selectedStaffId: number | null;
  onUpdateStaffInfo?: (staffId: number, updates: Partial<StaffMember>) => void;
}

export const ScheduleManager = ({
  staff,
  onAddShift,
  selectedStaffId,
  onUpdateStaffInfo
}: ScheduleManagerProps) => {
  const [activeTab, setActiveTab] = useState("schedule");
  const selectedStaff = staff.find(s => s.id === selectedStaffId);

  const handleUpdatePersonalInfo = (updates: Partial<StaffMember>) => {
    if (selectedStaffId && onUpdateStaffInfo) {
      onUpdateStaffInfo(selectedStaffId, updates);
    }
  };

  const handleAddShift = (date: string, time: string) => {
    if (selectedStaffId) {
      onAddShift(selectedStaffId, date, time);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Staff Management</h2>
        <Button variant="outline" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      {selectedStaff ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5 gap-4">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="payment">Payment Details</TabsTrigger>
            <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <AddShiftForm onAddShift={handleAddShift} />
              <WeeklySchedule staff={selectedStaff} />
            </div>
          </TabsContent>

          <TabsContent value="personal">
            <PersonalInfoForm 
              staff={selectedStaff}
              onUpdateInfo={handleUpdatePersonalInfo}
            />
          </TabsContent>

          <TabsContent value="payment">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Payment Information</h3>
              <p className="text-muted-foreground">Payment details coming soon...</p>
            </Card>
          </TabsContent>

          <TabsContent value="qualifications">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Qualifications</h3>
              <p className="text-muted-foreground">Qualifications module coming soon...</p>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Documents</h3>
              <p className="text-muted-foreground">Document management coming soon...</p>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            Select a staff member to view and manage their information
          </p>
        </Card>
      )}
    </div>
  );
};
