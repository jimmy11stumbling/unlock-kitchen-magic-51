
import type { DatabaseStaffMember } from '../../types/databaseTypes';

// Mock staff data for development and testing
export const mockStaffData: DatabaseStaffMember[] = [
  {
    id: 1,
    name: "John Doe",
    role: "manager",
    email: "john.doe@restaurant.com",
    phone: "555-123-4567",
    status: "active",
    salary: 65000,
    schedule: {
      monday: "09:00-17:00",
      tuesday: "09:00-17:00",
      wednesday: "09:00-17:00",
      thursday: "09:00-17:00",
      friday: "09:00-17:00",
      saturday: "OFF",
      sunday: "OFF"
    },
    certifications: ["Food Safety", "Management"],
    performance_rating: 9,
    notes: "Restaurant manager with 8 years of experience",
    department: "management",
    created_at: "2022-01-01T00:00:00.000Z",
    updated_at: "2023-04-15T00:00:00.000Z"
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "chef",
    email: "jane.smith@restaurant.com",
    phone: "555-987-6543",
    status: "active",
    salary: 55000,
    schedule: {
      monday: "14:00-22:00",
      tuesday: "14:00-22:00",
      wednesday: "OFF",
      thursday: "14:00-22:00",
      friday: "14:00-22:00",
      saturday: "14:00-22:00",
      sunday: "OFF"
    },
    certifications: ["Culinary Arts", "Food Safety"],
    performance_rating: 8,
    notes: "Head chef specializing in Italian cuisine",
    department: "kitchen",
    created_at: "2022-03-10T00:00:00.000Z",
    updated_at: "2023-05-20T00:00:00.000Z"
  },
  // Remove access_level which is causing an error
  {
    id: 3,
    name: "David Johnson",
    role: "server",
    email: "david.j@restaurant.com",
    phone: "555-456-7890",
    status: "on_break",
    salary: 35000,
    schedule: {
      monday: "OFF",
      tuesday: "16:00-24:00",
      wednesday: "16:00-24:00",
      thursday: "16:00-24:00",
      friday: "16:00-24:00",
      saturday: "16:00-24:00",
      sunday: "OFF"
    },
    certifications: ["Customer Service"],
    performance_rating: 7,
    notes: "Server with 3 years of experience",
    department: "service",
    created_at: "2022-05-20T00:00:00.000Z",
    updated_at: "2023-06-15T00:00:00.000Z"
  }
];
