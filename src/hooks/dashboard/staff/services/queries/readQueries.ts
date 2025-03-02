import { staffMappers } from "../../utils/staffMapper";
import type { StaffMember } from "@/types/staff";

export const getAllStaffMembers = async (): Promise<StaffMember[]> => {
  // Mock implementation - replace with actual data fetching
  return [
    {
      id: 1,
      name: "John Doe",
      role: "manager",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      status: "active",
      salary: 60000,
      hireDate: "2022-01-01",
      schedule: {
        monday: "09:00-17:00",
        tuesday: "09:00-17:00",
        wednesday: "09:00-17:00",
        thursday: "09:00-17:00",
        friday: "09:00-17:00",
        saturday: "OFF",
        sunday: "OFF",
      },
      certifications: ["Management", "Food Safety"],
      performanceRating: 9,
      notes: "Excellent manager",
      department: "management",
      shift: "Morning",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "chef",
      email: "jane.smith@example.com",
      phone: "987-654-3210",
      status: "active",
      salary: 55000,
      hireDate: "2022-02-15",
      schedule: {
        monday: "OFF",
        tuesday: "14:00-22:00",
        wednesday: "14:00-22:00",
        thursday: "14:00-22:00",
        friday: "14:00-22:00",
        saturday: "14:00-22:00",
        sunday: "OFF",
      },
      certifications: ["Culinary Arts", "Food Safety"],
      performanceRating: 8,
      notes: "Creative chef",
      department: "kitchen",
      shift: "Evening",
    },
  ];
};

export const getStaffMemberById = async (id: number): Promise<any> => {
  // Mock implementation - replace with actual data fetching
  const allStaff = await getAllStaffMembers();
  const staff = allStaff.find((staff) => staff.id === id);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!staff) {
    console.log(`Staff member with id ${id} not found`);
    return null;
  }

  const schedule = staffMappers.parseSchedule(staff.schedule);
  const certifications = staffMappers.parseCertifications(staff.certifications);

  return {
    ...staff,
    schedule,
    certifications,
  };
};
