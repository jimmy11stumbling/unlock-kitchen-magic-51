
import { useState, useEffect } from "react";
import { useStaffBasic } from "./staff/useStaffBasic";
import type { StaffMember } from "@/types/staff";

export const useStaffState = () => {
  const { staff, loading, addStaffMember, updateStaffStatus, updateStaffInfo } = useStaffBasic();
  const [shifts, setShifts] = useState<any[]>([]);
  
  const calculateWeeklyHours = (staffId: number) => {
    // Get staff member
    const staffMember = staff.find(s => s.id === staffId);
    if (!staffMember || !staffMember.schedule) return 0;
    
    // Get schedule
    const schedule = staffMember.schedule;
    let totalHours = 0;
    
    // Calculate hours for each day
    Object.values(schedule).forEach(timeSlot => {
      if (typeof timeSlot === 'string' && timeSlot !== 'OFF') {
        const [start, end] = timeSlot.split('-');
        const startHour = parseInt(start.split(':')[0]);
        const endHour = parseInt(end.split(':')[0]);
        totalHours += endHour - startHour;
      }
    });
    
    return totalHours;
  };
  
  const addShift = (staffId: number, date: string, time: string) => {
    // Create a new shift
    const newShift = {
      id: shifts.length + 1,
      staffId,
      date,
      startTime: time.split('-')[0],
      endTime: time.split('-')[1],
      status: "scheduled",
      notes: ""
    };
    
    setShifts([...shifts, newShift]);
    
    // Update staff schedule
    const staffMember = staff.find(s => s.id === staffId);
    if (staffMember) {
      const dateObj = new Date(date);
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayOfWeek = dayNames[dateObj.getDay()];
      
      updateStaffInfo(staffId, {
        schedule: {
          ...staffMember.schedule,
          [dayOfWeek]: time
        }
      });
    }
  };
  
  return {
    staff,
    shifts,
    isLoading: loading,
    addStaffMember,
    updateStaffStatus,
    updateStaffInfo,
    calculateWeeklyHours,
    addShift
  };
};
