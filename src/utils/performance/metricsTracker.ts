import type { StaffMember } from "@/types/staff";

export const calculatePerformanceMetrics = (staff: StaffMember[]) => {
  return staff.map(member => ({
    id: member.id,
    name: member.name,
    rating: member.performance_rating,
  }));
};
