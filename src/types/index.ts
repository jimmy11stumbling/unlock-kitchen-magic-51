
// Re-export all types from their respective files
export * from './analytics';
export * from './inventory';
export * from './kitchen';
export * from './menu';
export * from './orders';
export * from './payroll';
export * from './staff';
export * from './tables';

// Add missing types
export interface Shift {
  id: number;
  staffId: number;
  startTime: string;
  endTime: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Message {
  id: number;
  content: string;
  timestamp: string;
  sender: string;
  recipient: string;
  status: 'sent' | 'delivered' | 'read';
}
