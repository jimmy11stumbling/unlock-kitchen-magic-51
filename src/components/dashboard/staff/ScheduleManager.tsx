
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { StaffMember } from "@/types/staff";

interface ScheduleManagerProps {
  staff: StaffMember[];
  onAddShift: (staffId: number, date: string, time: string) => void;
  calculateWeeklyHours: (staffId: number) => number;
  selectedStaffId: number | null;
}

export const ScheduleManager = ({
  staff,
  onAddShift,
  calculateWeeklyHours,
  selectedStaffId,
}: ScheduleManagerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedShiftTime, setSelectedShiftTime] = useState("Morning");

  const handleAddShift = () => {
    if (selectedStaffId && selectedDate) {
      const shiftTimes = {
        Morning: "06:00-14:00",
        Afternoon: "14:00-22:00",
        Evening: "22:00-06:00"
      };
      
      onAddShift(
        selectedStaffId,
        selectedDate.toISOString().split('T')[0],
        shiftTimes[selectedShiftTime as keyof typeof shiftTimes]
      );
    }
  };

  const selectedMember = staff.find(m => m.id === selectedStaffId);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Schedule Management</h3>
        {selectedMember ? (
          <>
            <p className="text-sm text-muted-foreground">
              Managing schedule for {selectedMember.name}
            </p>
            <div className="space-y-4">
              <Select
                value={selectedShiftTime}
                onValueChange={setSelectedShiftTime}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select shift time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Morning">Morning Shift (6AM - 2PM)</SelectItem>
                  <SelectItem value="Afternoon">Afternoon Shift (2PM - 10PM)</SelectItem>
                  <SelectItem value="Evening">Evening Shift (10PM - 6AM)</SelectItem>
                </SelectContent>
              </Select>

              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />

              <Button
                onClick={handleAddShift}
                className="w-full"
                disabled={!selectedDate}
              >
                Add Shift
              </Button>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground">Select a staff member to manage their schedule</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Weekly Schedule Overview</h3>
        <div className="space-y-4">
          {staff.map((member) => (
            <Card key={member.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {calculateWeeklyHours(member.id)} hrs
                  </p>
                  <p className="text-sm text-muted-foreground">This Week</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
