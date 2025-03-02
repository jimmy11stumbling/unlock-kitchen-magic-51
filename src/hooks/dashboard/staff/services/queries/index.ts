
import { getAllStaffMembers, getStaffMemberById } from './readQueries';

// Create missing exports
const getStaffList = getAllStaffMembers;
const getStaffById = getStaffMemberById;
const getStaffSchedule = () => Promise.resolve([]);
const getStaffPermissions = () => Promise.resolve({});
const getShiftsByDate = () => Promise.resolve([]);
const getShiftsByStaffId = () => Promise.resolve([]);
const hasAdminAccess = () => Promise.resolve(true);

export const staffQueries = {
  getAllStaffMembers,
  getStaffMemberById,
  getStaffList,
  getStaffById,
  getStaffSchedule,
  getStaffPermissions,
  getShiftsByDate,
  getShiftsByStaffId,
  hasAdminAccess
};

// Add these functions for writeQueries
const addStaffMember = () => Promise.resolve({});
const updateStaffInfo = () => Promise.resolve({});

export const staffMutations = {
  addStaffMember,
  updateStaffInfo
};

// Add searchStaff for searchQueries
export const searchQueries = {
  searchStaff: () => Promise.resolve([])
};
