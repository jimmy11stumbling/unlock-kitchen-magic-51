
import { Card } from "@/components/ui/card";
import type { StaffMember } from "@/types/staff";

interface WeeklyScheduleProps {
  staff: StaffMember | undefined;
}

export const WeeklySchedule = ({ staff }: WeeklyScheduleProps) => {
  if (!staff) return null;

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Weekly Schedule</h3>
      <div className="space-y-2">
        {Object.entries(staff.schedule).map(([day, time]) => (
          <div key={day} className="flex justify-between items-center py-2 border-b">
            <span className="capitalize">{day}</span>
            <span className="font-medium">{time === "OFF" ? "Off" : time}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
