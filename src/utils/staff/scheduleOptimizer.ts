import type { Shift, StaffMember } from "@/types/staff";

export const optimizeSchedule = (shifts: Shift[], staff: StaffMember[]) => {
  return shifts.map(shift => ({
    ...shift,
    startTime: shift.startTime,
    endTime: shift.endTime
  }));
};
