
import type { MenuItem } from "@/types/staff";

export interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  state: string;
  businessHours: Record<string, { open: string; close: string }>;
}

export interface LayoutInfo {
  sections: Array<{ name: string; tables: number }>;
  defaultCapacities: number[];
}

export interface MenuSetupInfo {
  categories: string[];
  itemDefaults: {
    preparationTime: number;
    allergenOptions: string[];
  };
  inventory: {
    trackInventory: boolean;
    lowStockAlerts: boolean;
    autoReorder: boolean;
  };
}

export interface StaffSetupInfo {
  roles: Array<{
    name: string;
    permissions: string[];
    maxMembers: number | null;
  }>;
  schedulePreferences: {
    shiftsPerDay: number;
    minHoursPerShift: number;
    maxHoursPerWeek: number;
  };
}

export interface PaymentSetupInfo {
  methods: Array<{
    type: "cash" | "card" | "mobile";
    enabled: boolean;
  }>;
  taxRate: number;
  gratuityOptions: number[];
  autoGratuity: {
    enabled: boolean;
    partySize: number;
    percentage: number;
  };
}

export interface KitchenSetupInfo {
  stations: string[];
  printerLocations: string[];
  preparationAlerts: {
    enabled: boolean;
    timeThreshold: number;
  };
  displayPreferences: {
    groupByCategory: boolean;
    showTimers: boolean;
    showNotes: boolean;
  };
}
