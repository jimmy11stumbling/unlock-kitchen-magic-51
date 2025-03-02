import type { StaffMember } from "@/types/staff";

export const calculateAveragePerformance = (staff: StaffMember[]): number => {
  const staffWithRatings = staff.filter(member => 
    member.performanceRating !== undefined
  );
  
  if (staffWithRatings.length === 0) return 0;
  
  const sum = staffWithRatings.reduce((total, member) => {
    const rating = typeof member.performanceRating === 'number' 
      ? member.performanceRating 
      : 0;
    return total + rating;
  }, 0);
  
  return sum / staffWithRatings.length;
};

export const getTopPerformers = (staff: StaffMember[], count: number = 3): StaffMember[] => {
  return [...staff]
    .filter(member => typeof member.performanceRating === 'number')
    .sort((a, b) => {
      const ratingA = typeof a.performanceRating === 'number' ? a.performanceRating : 0;
      const ratingB = typeof b.performanceRating === 'number' ? b.performanceRating : 0;
      return ratingB - ratingA;
    })
    .slice(0, count);
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
