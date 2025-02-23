
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
}

export const ScheduleManager = ({
  staff,
  onAddShift,
  calculateWeeklyHours,
}: ScheduleManagerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedShiftTime, setSelectedShiftTime] = useState("Morning");
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);

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

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Add New Shift</h3>
        <div className="space-y-4">
          <Select
            value={selectedStaffId?.toString() || ""}
            onValueChange={(value) => setSelectedStaffId(Number(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select staff member" />
            </SelectTrigger>
            <SelectContent>
              {staff.map((member) => (
                <SelectItem key={member.id} value={member.id.toString()}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />

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

          <Button
            onClick={handleAddShift}
            className="w-full"
            disabled={!selectedStaffId || !selectedDate}
          >
            Add Shift
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Weekly Hours Summary</h3>
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
