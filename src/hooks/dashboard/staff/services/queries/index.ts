
export * from './readQueries';
export * from './writeQueries';
export * from './searchQueries';

export const hasAdminAccess = (staffMember: import('@/types/staff').StaffMember | null): boolean => {
  if (!staffMember) return false;
  return staffMember.role === 'manager';
};
