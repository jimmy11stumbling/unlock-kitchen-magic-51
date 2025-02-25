
import { useState } from 'react';
import { StaffMember } from '@/types';
import { Card } from "@/components/ui/card";

interface WeeklyScheduleProps {
  staff: StaffMember;
}

export const WeeklySchedule = ({ staff }: WeeklyScheduleProps) => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const formatShiftTime = (time: string) => {
    if (time === 'OFF') return 'Off';
    return time;
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Weekly Schedule</h3>
      <div className="space-y-2">
        {days.map((day) => (
          <div key={day} className="flex justify-between items-center">
            <span className="capitalize">{day}</span>
            <span>{formatShiftTime(staff.schedule[day])}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
