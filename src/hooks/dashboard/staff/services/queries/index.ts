
import { readQueries } from './readQueries';
import * as writeQueries from './writeQueries';

export * from './readQueries';
export * from './writeQueries';

export const hasAdminAccess = (staffMember: import('@/types/staff').StaffMember | null): boolean => {
  if (!staffMember) return false;
  return staffMember.role === 'manager';
};

export const getStaffPermissions = async (staffId: number): Promise<string[]> => {
  try {
    // This is a mock function until we have actual permissions implementation
    return ['view_all', 'edit_menu', 'manage_staff', 'view_analytics', 'process_payments'];
  } catch (error) {
    console.error('Error fetching staff permissions:', error);
    throw error;
  }
};
