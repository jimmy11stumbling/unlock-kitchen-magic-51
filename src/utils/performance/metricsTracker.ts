import { StaffMember } from "@/types/staff";

export const calculateAveragePerformance = (staffMembers: StaffMember[]): number => {
  const validRatings = staffMembers
    .filter(staff => staff.performanceRating !== undefined)
    .map(staff => staff.performanceRating as number);
  
  if (validRatings.length === 0) return 0;
  
  const sum = validRatings.reduce((total, rating) => total + rating, 0);
  return sum / validRatings.length;
};

export const calculateTotalSalary = (staffMembers: StaffMember[]): number => {
  return staffMembers.reduce((total, staff) => total + (staff.salary || 0), 0);
};

export const calculateStaffCount = (staffMembers: StaffMember[]): number => {
  return staffMembers.length;
};

export const calculateAverageHoursWorked = (staffMembers: StaffMember[]): number => {
  const totalHours = staffMembers.reduce((total, staff) => {
    const hours = staff.schedule ? Object.values(staff.schedule).reduce((sum, time) => {
      if (typeof time === 'string' && time !== "OFF") {
        const [start, end] = time.split("-");
        const startHour = parseInt(start.split(":")[0] || "0");
        const endHour = parseInt(end.split(":")[0] || "0");
        return sum + (endHour > startHour ? endHour - startHour : 24 - startHour + endHour);
      }
      return sum;
    }, 0) : 0;
    return total + hours;
  }, 0);
  
  return staffMembers.length > 0 ? totalHours / staffMembers.length : 0;
};
