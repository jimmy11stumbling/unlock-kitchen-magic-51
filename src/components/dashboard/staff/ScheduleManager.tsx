
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import type { StaffMember } from "@/types/staff";
import { WeeklySchedule } from "./schedule/WeeklySchedule";
import { PersonalInfoForm } from "./schedule/PersonalInfoForm";
import { DocumentsCard } from "./schedule/DocumentsCard";
import { CertificationsCard } from "./schedule/CertificationsCard";
import { StaffMetricsCard } from "./schedule/StaffMetricsCard";
import { ReactNode } from "react";

interface ScheduleManagerProps {
  staff: StaffMember[];
  onAddShift: (staffId: number, date: string, time: string) => void;
  calculateWeeklyHours: (staffId: number) => number;
  selectedStaffId: number | null;
  onUpdateStaffInfo: (staffId: number, updates: Partial<StaffMember>) => Promise<void>;
}

export const ScheduleManager = ({
  staff,
  onAddShift,
  calculateWeeklyHours,
  selectedStaffId,
  onUpdateStaffInfo
}: ScheduleManagerProps) => {
  const { toast } = useToast();
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [newShiftDate, setNewShiftDate] = useState("");
  const [newShiftTime, setNewShiftTime] = useState("");

  useEffect(() => {
    if (selectedStaffId) {
      const staffMember = staff.find(s => s.id === selectedStaffId);
      setSelectedStaff(staffMember || null);
    } else {
      setSelectedStaff(null);
    }
  }, [selectedStaffId, staff]);

  const handleAddShift = () => {
    if (!selectedStaff || !newShiftDate || !newShiftTime) {
      toast({
        title: "Error",
        description: "Please select a staff member, date, and time.",
        variant: "destructive",
      });
      return;
    }

    onAddShift(selectedStaff.id, newShiftDate, newShiftTime);
    setNewShiftDate("");
    setNewShiftTime("");
    toast({
      title: "Shift Added",
      description: `Shift added for ${selectedStaff.name} on ${newShiftDate} at ${newShiftTime}.`,
    });
  };

  const handleUpdateStaffInfo = async (updates: Partial<StaffMember>) => {
    if (!selectedStaff) return;
    try {
      await onUpdateStaffInfo(selectedStaff.id, updates);
      toast({
        title: "Staff Info Updated",
        description: "Staff information updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update staff information.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {staff.map((staffMember) => (
              <div key={staffMember.id} className="mb-4">
                <h3 className="text-lg font-semibold">{staffMember.name}</h3>
                <StaffMetricsCard 
                  staffMember={staffMember} 
                  calculateWeeklyHours={calculateWeeklyHours} 
                />
                <div className="grid grid-cols-7 gap-2 mt-2">
                  {Object.keys(staffMember.schedule || {}).map((day) => (
                    <div key={day} className="text-center">
                      <div className="font-medium capitalize">{day}</div>
                      <div className="text-sm">
                        {staffMember.schedule && typeof staffMember.schedule[day] === 'string' 
                          ? staffMember.schedule[day] as ReactNode 
                          : "N/A"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add New Shift</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-shift-date">Date</Label>
                <Input
                  type="date"
                  id="new-shift-date"
                  value={newShiftDate}
                  onChange={(e) => setNewShiftDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="new-shift-time">Time</Label>
                <Input
                  type="time"
                  id="new-shift-time"
                  value={newShiftTime}
                  onChange={(e) => setNewShiftTime(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleAddShift}>Add Shift</Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedStaff ? (
              <PersonalInfoForm 
                staffMember={selectedStaff} 
                onUpdate={handleUpdateStaffInfo} 
              />
            ) : (
              <p className="text-muted-foreground">Select a staff member to view information.</p>
            )}
          </CardContent>
        </Card>

        <DocumentsCard 
          staffMember={selectedStaff} 
        />

        <CertificationsCard 
          staffMember={selectedStaff} 
        />
      </div>
    </div>
  );
};
