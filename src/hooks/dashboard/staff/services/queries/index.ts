
import { getAllStaffMembers, getStaffMemberById } from './readQueries';
import type { StaffMember } from '@/types/staff';

// Add missing functions
const getStaffList = getAllStaffMembers;
const getStaffById = getStaffMemberById;

const getStaffSchedule = async (staffId: number) => {
  const staff = await getStaffById(staffId);
  return staff?.schedule || {};
};

const getStaffPermissions = async (staffId: number) => {
  const staff = await getStaffById(staffId);
  const role = staff?.role || 'server';
  
  // Basic permission mapping based on role
  const permissions = {
    canEditMenu: ['manager', 'chef'].includes(role),
    canManageStaff: ['manager'].includes(role),
    canViewReports: ['manager'].includes(role),
    canProcessPayments: ['manager', 'server'].includes(role),
    canManageReservations: ['manager', 'host'].includes(role),
  };
  
  return permissions;
};

const hasAdminAccess = async (staffId: number) => {
  const staff = await getStaffById(staffId);
  return staff?.role === 'manager';
};

const getShiftsByDate = async (date: string): Promise<any[]> => {
  // This would be implemented with a real API or database
  // For now, return an empty array
  return [];
};

const getShiftsByStaffId = async (staffId: number): Promise<any[]> => {
  // This would be implemented with a real API or database
  // For now, return an empty array
  return [];
};

// Export all query functions
export const staffQueries = {
  getAllStaffMembers,
  getStaffMemberById,
  getStaffList,
  getStaffById,
  getStaffSchedule,
  getStaffPermissions,
  hasAdminAccess,
  getShiftsByDate,
  getShiftsByStaffId
};
