
import { readQueries } from './readQueries';
import { writeQueries } from './writeQueries';

export * from './readQueries';
export * from './writeQueries';

export const getStaffPermissions = async (staffId: number) => {
  try {
    // This is a mock function until we have actual permissions implementation
    return {
      canEditMenu: true,
      canManageStaff: true,
      canViewAnalytics: true,
      canProcessPayments: true
    };
  } catch (error) {
    console.error('Error fetching staff permissions:', error);
    throw error;
  }
};
