
export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage';
  description: string;
  available: boolean;
  allergens: string[];
  preparationTime: number;
  orderCount?: number;
  image?: string;
  popular?: boolean;
  calories?: number;
  prepTime?: number;
  ingredients?: string[];
  station?: string;
  prep_details?: {
    prepTime?: number;
    cookTime?: number;
    ingredients?: string[];
    steps?: string[];
    specialEquipment?: string[];
    equipment_needed?: string[];
    temperature_requirements?: string;
    quality_checks?: string[];
    notes?: string;
  };
}

export interface MenuItemFormData extends Omit<MenuItem, "id" | "orderCount"> {
  id?: number;
  preparationTime: number;
}
