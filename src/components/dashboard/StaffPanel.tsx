
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { StaffTable } from "./StaffTable";
import { ScheduleManager } from "./staff/ScheduleManager";
import { PayrollPanel } from "./staff/payroll/PayrollPanel";
import type { StaffMember, StaffStatus } from "@/types/staff";

export interface StaffPanelProps {
  staff: StaffMember[];
  onAddStaff: (data: Omit<StaffMember, "id" | "status">) => Promise<StaffMember>;
  onUpdateStatus: (staffId: number, newStatus: StaffStatus) => Promise<void>;
  onAddShift: (staffId: number, date: string, time: string) => void;
  onUpdateInfo: (staffId: number, updates: Partial<StaffMember>) => Promise<void>;
}

export const StaffPanel = ({
  staff,
  onAddStaff,
  onUpdateStatus,
  onAddShift,
  onUpdateInfo
}: StaffPanelProps) => {
  const [activeTab, setActiveTab] = useState("staff");
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Staff Management</h2>
        <Button onClick={() => setShowAddStaffForm(true)}>Add Staff Member</Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <Card>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
          </TabsList>

          <TabsContent value="staff" className="p-4">
            <StaffTable 
              staff={staff} 
              onUpdateStatus={onUpdateStatus}
              onUpdateInfo={onUpdateInfo}
            />
          </TabsContent>

          <TabsContent value="schedule" className="p-4">
            <ScheduleManager 
              staff={staff}
              onAddShift={onAddShift}
            />
          </TabsContent>

          <TabsContent value="payroll" className="p-4">
            <PayrollPanel staff={staff} />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};
