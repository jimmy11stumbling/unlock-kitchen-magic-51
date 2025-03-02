
export interface SalesData {
  date: string;
  revenue: number;
  profit: number;
  costs?: number;
}

export interface DailyReport {
  id: number;
  date: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topSellingItems: Array<{
    id: number;
    name: string;
    category: "appetizer" | "main" | "dessert" | "beverage";
    price: number;
    description: string;
    preparationTime: number;
    allergens: string[];
    available: boolean;
    image?: string;
    orderCount: number;
    prep_details?: {
      ingredients?: string[];
      equipment_needed?: string[];
      steps?: string[];
      quality_checks?: string[];
      temperature_requirements?: {
        min: number;
        max: number;
        unit: "F" | "C";
      };
    };
  }>;
  laborCosts: number;
  inventoryCosts: number;
  netProfit: number;
}
