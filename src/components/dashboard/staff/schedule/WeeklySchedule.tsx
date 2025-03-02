
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StaffMember } from "@/types/staff";

interface WeeklyScheduleProps {
  staff: StaffMember;
}

export const WeeklySchedule = ({ staff }: WeeklyScheduleProps) => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const formatTime = (timeString: string) => {
    if (timeString === 'OFF') return timeString;
    
    const [start, end] = timeString.split('-');
    const formatHour = (time: string) => {
      const [hour, minute] = time.split(':');
      const hourNum = parseInt(hour);
      return `${hourNum % 12 || 12}:${minute}${hourNum >= 12 ? 'PM' : 'AM'}`;
    };
    
    return `${formatHour(start)} - ${formatHour(end)}`;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Weekly Schedule</h3>
        <div className="space-y-4">
          {days.map((day, index) => (
            <div key={day} className="flex justify-between items-center pb-2 border-b">
              <div className="font-medium">{dayNames[index]}</div>
              <Badge 
                variant={staff.schedule[day as keyof typeof staff.schedule] === 'OFF' ? 'outline' : 'default'}
                className={staff.schedule[day as keyof typeof staff.schedule] === 'OFF' ? 'text-muted-foreground' : ''}
              >
                {formatTime(staff.schedule[day as keyof typeof staff.schedule] as string)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
