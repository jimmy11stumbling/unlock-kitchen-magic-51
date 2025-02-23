
export interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  state: string;
  businessHours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
}

export interface LayoutInfo {
  sections: {
    name: string;
    tables: number;
  }[];
  defaultCapacities: number[];
}

export interface MenuInfo {
  categories: string[];
  mealPeriods: string[];
  specialMenus: string[];
}

export interface StaffInfo {
  roles: string[];
  shifts: string[];
}

export interface PaymentInfo {
  methods: string[];
  tipPresets: number[];
  autoGratuity: boolean;
  autoGratuityThreshold: number;
}

export interface KitchenInfo {
  stations: string[];
  printers: string[];
  averagePrepTimes: {
    [category: string]: number;
  };
}
