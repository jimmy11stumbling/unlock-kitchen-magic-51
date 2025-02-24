
import type { StaffMember, Shift } from "@/types/staff";

export const optimizeSchedule = (staff: StaffMember[], shifts: Shift[]) => {
  const schedule: { [key: string]: StaffMember[] } = {};
  
  // Group shifts by date
  shifts.forEach(shift => {
    if (!schedule[shift.date]) {
      schedule[shift.date] = [];
    }
    
    // Find available staff for this shift
    const availableStaff = staff.filter(member => 
      member.status !== 'off_duty' && 
      !schedule[shift.date].find(s => s.id === member.id)
    );
    
    // Assign staff based on role requirements
    if (availableStaff.length > 0) {
      schedule[shift.date].push(availableStaff[0]);
    }
  });
  
  return schedule;
};

export const calculateStaffUtilization = (staff: StaffMember[], schedule: { [key: string]: StaffMember[] }) => {
  const utilization: { [key: number]: number } = {};
  
  staff.forEach(member => {
    const shifts = Object.values(schedule).filter(dayStaff => 
      dayStaff.find(s => s.id === member.id)
    ).length;
    
    utilization[member.id] = (shifts / Object.keys(schedule).length) * 100;
  });
  
  return utilization;
};
