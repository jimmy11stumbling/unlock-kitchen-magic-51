
export * from './analytics';
export * from './inventory';
export * from './kitchen';
export * from './menu';
export * from './orders';
export * from './staff';
export * from './tables';

export interface JsonResponse {
  data?: any;
  error?: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'system';
}

// Add any other shared interfaces/types here
