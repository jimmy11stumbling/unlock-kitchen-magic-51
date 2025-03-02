
import { readQueries } from './readQueries';
// Import proper writeQueries once they're implemented
// import { writeQueries } from './writeQueries';

// Export read queries
export const {
  getStaffList,
  getStaffById,
  getStaffSchedule,
  getStaffPermissions,
  getShiftsByDate,
  getShiftsByStaffId
} = readQueries;

// Function to check if a staff member has admin/manager access
export const hasAdminAccess = (staffMember: any | null): boolean => {
  if (!staffMember) return false;
  return staffMember.role === 'manager' || staffMember.role === 'owner';
};

// Export write queries once implemented
// export const { createStaff, updateStaff, deleteStaff } = writeQueries;
