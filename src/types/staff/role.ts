
export type StaffRole = 'manager' | 'chef' | 'server' | 'bartender' | 'host';

export interface StaffRoleDefinition {
  id: StaffRole;
  name: string;
  description: string;
  permissions: string[];
  baseHourlyRate: number;
  department: string;
}

export const staffRoleDefinitions: Record<StaffRole, StaffRoleDefinition> = {
  manager: {
    id: 'manager',
    name: 'Restaurant Manager',
    description: 'Oversees all restaurant operations',
    permissions: ['staff_management', 'finance_access', 'inventory_full', 'reports_full'],
    baseHourlyRate: 25,
    department: 'management'
  },
  chef: {
    id: 'chef',
    name: 'Chef',
    description: 'Prepares food and manages kitchen staff',
    permissions: ['kitchen_management', 'inventory_view', 'menu_edit'],
    baseHourlyRate: 22,
    department: 'kitchen'
  },
  server: {
    id: 'server',
    name: 'Server',
    description: 'Takes orders and serves customers',
    permissions: ['order_management', 'menu_view'],
    baseHourlyRate: 15,
    department: 'service'
  },
  bartender: {
    id: 'bartender',
    name: 'Bartender',
    description: 'Prepares and serves drinks',
    permissions: ['bar_management', 'inventory_view'],
    baseHourlyRate: 18,
    department: 'bar'
  },
  host: {
    id: 'host',
    name: 'Host/Hostess',
    description: 'Greets customers and manages reservations',
    permissions: ['reservation_management'],
    baseHourlyRate: 14,
    department: 'service'
  }
};
