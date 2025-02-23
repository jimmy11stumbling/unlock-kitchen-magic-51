
import { useStaffBasic } from "./staff/useStaffBasic";
import { useShiftManagement } from "./staff/useShiftManagement";
import { usePerformanceManagement } from "./staff/usePerformanceManagement";
import type { StaffMember } from "@/types/staff";

export const useStaffState = () => {
  const { staff, loading, addStaffMember, updateStaffStatus, updateStaffInfo } = useStaffBasic();
  const { shifts, addShift } = useShiftManagement();
  const { updateStaffPerformance, updateStaffSchedule, updateCertifications } = usePerformanceManagement();

  const calculateAttendance = (staffId: number): number => {
    const member = staff.find(m => m.id === staffId);
    if (!member) return 0;

    const scheduledDays = Object.values(member.schedule).filter(day => day !== "OFF").length;
    const totalPossibleDays = 7;
    
    return Math.round((scheduledDays / totalPossibleDays) * 100);
  };

  const calculateWeeklyHours = (staffId: number): number => {
    const member = staff.find(m => m.id === staffId);
    if (!member?.schedule) return 0;

    return Object.values(member.schedule)
      .filter(time => time !== "OFF")
      .reduce((total, time) => {
        const [start, end] = time.split("-");
        const startHour = parseInt(start.split(":")[0]);
        const endHour = parseInt(end.split(":")[0]);
        return total + (endHour > startHour ? endHour - startHour : 24 - startHour + endHour);
      }, 0);
  };

  return {
    staff,
    loading,
    shifts,
    addStaffMember,
    updateStaffStatus,
    addShift,
    updateStaffInfo,
    updateStaffSchedule,
    updateStaffPerformance,
    updateCertifications,
    calculateAttendance,
    calculateWeeklyHours,
  };
};
