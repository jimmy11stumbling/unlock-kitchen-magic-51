
import type { DatabaseStaffMember } from "../../types/databaseTypes";

export const mockStaffData: DatabaseStaffMember[] = [
  {
    id: 1,
    name: "John Smith",
    role: "manager",
    status: "active",
    shift: "Morning",
    salary: 65000,
    hourly_rate: 31.25,
    overtime_rate: 46.88,
    email: "john.smith@restaurant.com",
    phone: "555-0101",
    address: "123 Main St",
    emergency_contact: {
      name: "Jane Smith",
      phone: "555-0102",
      relationship: "spouse"
    },
    created_at: "2023-01-15",
    department: "management",
    certifications: ["ServSafe Manager", "Food Handler", "Alcohol Service"],
    performance_rating: 4.8,
    notes: "Regional manager for downtown locations",
    schedule: {
      monday: "9:00-17:00",
      tuesday: "9:00-17:00",
      wednesday: "9:00-17:00",
      thursday: "9:00-17:00",
      friday: "9:00-17:00",
      saturday: "OFF",
      sunday: "OFF"
    },
    bank_info: {
      accountNumber: "****1234",
      routingNumber: "****5678",
      accountType: "checking"
    },
    employment_status: "full_time",
    hire_date: "2023-01-15",
    benefits: {},
    updated_at: new Date().toISOString(),
    tax_id: "123-45-6789"
  }
];
