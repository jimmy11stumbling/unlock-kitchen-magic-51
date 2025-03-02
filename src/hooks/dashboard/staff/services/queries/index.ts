
// Export read queries
import { getAllStaffMembers, getStaffMemberById, getStaffList, getStaffById, getStaffSchedule, getStaffPermissions, getShiftsByDate, getShiftsByStaffId, hasAdminAccess } from './readQueries';

// Export write queries
import { updateStaffStatus, addStaffMember, updateStaffInfo } from './writeQueries';

// Export search queries
import { searchStaff } from './searchQueries';

// Export all queries as a single object
export const staffQueries = {
  getAllStaffMembers,
  getStaffMemberById,
  getStaffList,
  getStaffById,
  getStaffSchedule,
  getStaffPermissions,
  getShiftsByDate,
  getShiftsByStaffId,
  hasAdminAccess,
  updateStaffStatus,
  addStaffMember,
  updateStaffInfo,
  searchStaff
};

// Also export individual functions for direct imports
export {
  getAllStaffMembers,
  getStaffMemberById,
  getStaffList,
  getStaffById,
  getStaffSchedule,
  getStaffPermissions,
  getShiftsByDate,
  getShiftsByStaffId,
  hasAdminAccess,
  updateStaffStatus,
  addStaffMember,
  updateStaffInfo,
  searchStaff
};
