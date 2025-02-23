
import type { StaffMember, Shift } from "@/types/staff";

export const checkScheduleConflicts = (
  staffMember: StaffMember,
  newShift: Shift
): boolean => {
  const existingShift = Object.entries(staffMember.schedule)
    .find(([day, hours]) => {
      if (new Date(newShift.date).toLocaleLowerCase().includes(day)) {
        const [existingStart, existingEnd] = hours.split('-');
        const newTime = newShift.time;
        return isTimeConflict(existingStart, existingEnd, newTime);
      }
      return false;
    });

  return !!existingShift;
};

export const optimizeStaffSchedule = (
  staff: StaffMember[],
  shifts: Shift[]
): { staffId: number; shiftId: number }[] => {
  const assignments: { staffId: number; shiftId: number }[] = [];
  const staffWorkload = new Map<number, number>();

  // Initialize workload tracking
  staff.forEach(member => staffWorkload.set(member.id, 0));

  // Sort shifts by date
  const sortedShifts = [...shifts].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Assign shifts trying to balance workload
  sortedShifts.forEach(shift => {
    const availableStaff = staff.filter(member => 
      !checkScheduleConflicts(member, shift)
    );

    if (availableStaff.length > 0) {
      // Find staff member with lowest current workload
      const staffChoice = availableStaff.reduce((prev, curr) => {
        const prevLoad = staffWorkload.get(prev.id) || 0;
        const currLoad = staffWorkload.get(curr.id) || 0;
        return prevLoad <= currLoad ? prev : curr;
      });

      assignments.push({ staffId: staffChoice.id, shiftId: shift.id });
      staffWorkload.set(staffChoice.id, (staffWorkload.get(staffChoice.id) || 0) + 1);
    }
  });

  return assignments;
};

const isTimeConflict = (
  existingStart: string,
  existingEnd: string,
  newTime: string
): boolean => {
  const [newStart, newEnd] = newTime.split('-');
  return !(newEnd <= existingStart || newStart >= existingEnd);
};
