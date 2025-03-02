
import type { StaffMember, StaffDTO } from "@/types/staff";

/**
 * Maps database DTO to frontend StaffMember model
 */
export const mapStaffDtoToModel = (dto: StaffDTO): StaffMember => {
  let schedule = {};
  let certifications = [];
  
  // Safely parse schedule from JSON string or object
  try {
    if (dto.schedule) {
      schedule = typeof dto.schedule === 'string' 
        ? JSON.parse(dto.schedule) 
        : dto.schedule;
    } else {
      schedule = {
        monday: "OFF",
        tuesday: "OFF",
        wednesday: "OFF",
        thursday: "OFF",
        friday: "OFF",
        saturday: "OFF",
        sunday: "OFF"
      };
    }
  } catch (error) {
    console.error("Error parsing schedule:", error);
    schedule = {};
  }
  
  // Safely parse certifications from JSON string or array
  try {
    if (dto.certifications) {
      certifications = typeof dto.certifications === 'string'
        ? JSON.parse(dto.certifications)
        : (Array.isArray(dto.certifications) ? dto.certifications : []);
    }
  } catch (error) {
    console.error("Error parsing certifications:", error);
    certifications = [];
  }
  
  return {
    id: dto.id,
    name: dto.name,
    role: dto.role || 'server',
    email: dto.email || '',
    phone: dto.phone || '',
    status: dto.status || 'off_duty',
    salary: dto.salary || 0,
    hireDate: dto.hire_date || new Date().toISOString().split('T')[0],
    schedule: schedule,
    certifications: certifications,
    performanceRating: dto.performance_rating || 0,
    notes: dto.notes || '',
    department: dto.department || 'service',
  };
};

/**
 * Maps frontend StaffMember model to database DTO
 */
export const mapStaffModelToDto = (model: StaffMember): StaffDTO => {
  let scheduleString = '';
  let certificationsArray = [];
  
  // Safely stringify schedule
  try {
    scheduleString = typeof model.schedule === 'string'
      ? model.schedule
      : JSON.stringify(model.schedule || {});
  } catch (error) {
    console.error("Error stringifying schedule:", error);
    scheduleString = '{}';
  }
  
  // Safely handle certifications
  try {
    certificationsArray = typeof model.certifications === 'string'
      ? JSON.parse(model.certifications)
      : (Array.isArray(model.certifications) ? model.certifications : []);
  } catch (error) {
    console.error("Error processing certifications:", error);
    certificationsArray = [];
  }
  
  return {
    id: model.id,
    name: model.name,
    role: model.role,
    email: model.email,
    phone: model.phone,
    status: model.status,
    salary: model.salary,
    hire_date: model.hireDate,
    schedule: scheduleString,
    certifications: certificationsArray,
    performance_rating: model.performanceRating,
    notes: model.notes,
    department: model.department,
  };
};
