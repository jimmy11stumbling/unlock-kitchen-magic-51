
import type { StaffMember } from "@/types/staff";

// Fix the undefined object issues at lines 22 and 114
const parseSchedule = (scheduleData: any) => {
  if (!scheduleData) return {};
  
  try {
    // If it's a string, try to parse it as JSON
    if (typeof scheduleData === 'string') {
      return JSON.parse(scheduleData);
    }
    // If it's already an object, return it
    return scheduleData;
  } catch (error) {
    console.error('Error parsing schedule:', error);
    return {}; // Return empty object on error
  }
};

const parseCertifications = (certData: any) => {
  if (!certData) return [];
  
  try {
    // If it's a string, try to parse it as JSON
    if (typeof certData === 'string') {
      return JSON.parse(certData);
    }
    // If it's already an array, return it
    if (Array.isArray(certData)) {
      return certData;
    }
    return []; // Return empty array for invalid formats
  } catch (error) {
    // If it's a comma-separated string, split it
    if (typeof certData === 'string' && certData.includes(',')) {
      return certData.split(',').map(cert => cert.trim());
    }
    // If it's a single certification as string
    if (typeof certData === 'string') {
      return [certData];
    }
    console.error('Error parsing certifications:', error);
    return []; // Return empty array on error
  }
};

// Export the mappers as a single object for easier imports
export const staffMappers = {
  parseSchedule,
  parseCertifications
};
