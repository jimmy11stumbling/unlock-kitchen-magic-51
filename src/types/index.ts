
// Import and re-export from analytics
export type { AnalyticsMetric, AnalyticsPeriod, AnalyticsReport } from './analytics';

// Import and re-export from inventory
export type { InventoryItem, InventoryTransaction } from './inventory';

// Import and re-export from kitchen
export type { 
  KitchenOrderStatus,
  KitchenOrderPriority,
  KitchenCoursing,
  KitchenOrderItem,
  KitchenOrder 
} from './kitchen';

// Import and re-export from menu
export type { 
  MenuCategory,
  IngredientRequirement,
  MenuItem 
} from './menu';

// Import and re-export from orders
export type { 
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  OrderItem,
  Order 
} from './orders';

// Import and re-export from tables
export type { TableLayout, TableSection } from './tables';

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
