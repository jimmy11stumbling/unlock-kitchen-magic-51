
export * from './analytics';
export * from './inventory';
export * from './kitchen';
export * from './menu';
export * from './orders';
export * from './staff';
export * from './tables';

// Shared utility types
export interface BaseResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends BaseResponse {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}
