
export * from './readQueries';
export * from './writeQueries';
export * from './searchQueries';

export const hasAdminAccess = (staffMember: import('@/types/staff').StaffMember | null): boolean => {
  if (!staffMember) return false;
  return staffMember.role === 'manager';
};

/**
 * Get permissions for a staff member based on their ID
 */
export const getStaffPermissions = async (staffId: number): Promise<string[]> => {
  try {
    // In a real app, this would fetch from the database
    // For now, return mock permissions based on staff role
    const { supabase } = await import('@/integrations/supabase/client');
    const { data, error } = await supabase
      .from('staff_members')
      .select('role')
      .eq('id', staffId)
      .single();
    
    if (error) throw error;
    
    if (!data) return [];
    
    // Define permissions based on role
    switch (data.role) {
      case 'manager':
        return ['view_all', 'edit_all', 'manage_staff', 'manage_inventory', 'view_reports', 'manage_payroll'];
      case 'chef':
        return ['view_kitchen', 'edit_kitchen', 'view_inventory', 'edit_inventory'];
      case 'server':
        return ['view_orders', 'create_orders', 'edit_orders'];
      case 'bartender':
        return ['view_orders', 'create_orders', 'view_inventory'];
      case 'host':
        return ['view_tables', 'edit_tables', 'view_reservations', 'edit_reservations'];
      default:
        return ['view_basic'];
    }
  } catch (error) {
    console.error('Error fetching staff permissions:', error);
    return [];
  }
};
