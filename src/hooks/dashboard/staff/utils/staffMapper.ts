import type { StaffMember, StaffStatus } from '@/types/staff';

export const staffMappers = {
  mapStatusToDatabase: (status: StaffStatus): 'active' | 'on_break' | 'off_duty' => {
    // Handle the mapping from StaffStatus to database status
    if (status === 'terminated') {
      return 'off_duty'; // Map terminated to off_duty as a fallback
    }
    return status as 'active' | 'on_break' | 'off_duty';
  },

  mapDatabaseStatusToStaffStatus: (status: 'active' | 'on_break' | 'off_duty'): StaffStatus => {
    return status as StaffStatus;
  },

  mapStaffMemberToDatabase: (staffMember: Partial<StaffMember>): any => {
    const mapped: any = { ...staffMember };
    
    // Convert status if present
    if (mapped.status) {
      mapped.status = this.mapStatusToDatabase(mapped.status);
    }
    
    // Handle schedule, emergency_contact, etc. conversion to JSON
    if (mapped.schedule && typeof mapped.schedule !== 'string') {
      mapped.schedule = JSON.stringify(mapped.schedule);
    }
    
    if (mapped.emergencyContact && typeof mapped.emergencyContact !== 'string') {
      mapped.emergency_contact = JSON.stringify(mapped.emergencyContact);
      delete mapped.emergencyContact;
    }
    
    if (mapped.bankInfo && typeof mapped.bankInfo !== 'string') {
      mapped.bank_info = JSON.stringify(mapped.bankInfo);
      delete mapped.bankInfo;
    }
    
    if (mapped.benefits && typeof mapped.benefits !== 'string') {
      mapped.benefits = JSON.stringify(mapped.benefits);
    }
    
    return mapped;
  },

  mapDatabaseToStaffMember: (data: any): StaffMember => {
    const staff: any = { ...data };
    
    // Convert schedule from JSON to object
    if (staff.schedule && typeof staff.schedule === 'string') {
      try {
        staff.schedule = JSON.parse(staff.schedule);
      } catch (e) {
        console.error('Error parsing schedule JSON:', e);
        staff.schedule = {};
      }
    } else if (typeof staff.schedule === 'object') {
      // Already an object, keep as is
    } else {
      staff.schedule = {};
    }
    
    // Convert emergency_contact from JSON to object
    if (staff.emergency_contact) {
      try {
        if (typeof staff.emergency_contact === 'string') {
          staff.emergencyContact = JSON.parse(staff.emergency_contact);
        } else {
          staff.emergencyContact = staff.emergency_contact;
        }
      } catch (e) {
        console.error('Error parsing emergency contact JSON:', e);
        staff.emergencyContact = { name: '', phone: '', relationship: '' };
      }
      delete staff.emergency_contact;
    }
    
    // Convert bank_info from JSON to object
    if (staff.bank_info) {
      try {
        if (typeof staff.bank_info === 'string') {
          staff.bankInfo = JSON.parse(staff.bank_info);
        } else {
          staff.bankInfo = staff.bank_info;
        }
      } catch (e) {
        console.error('Error parsing bank info JSON:', e);
        staff.bankInfo = {};
      }
      delete staff.bank_info;
    }
    
    // Convert benefits from JSON to object
    if (staff.benefits) {
      try {
        if (typeof staff.benefits === 'string') {
          staff.benefits = JSON.parse(staff.benefits);
        }
      } catch (e) {
        console.error('Error parsing benefits JSON:', e);
        staff.benefits = {};
      }
    }
    
    // Convert status
    if (staff.status) {
      staff.status = this.mapDatabaseStatusToStaffStatus(staff.status);
    }
    
    return staff as StaffMember;
  }
};
