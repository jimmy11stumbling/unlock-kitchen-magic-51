export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
  popular: boolean;
  allergens: string[];
  calories: number;
  prepTime: number;
  ingredients: string[];
  station?: string;
  prep_details?: {
    prepTime?: number;
    cookTime?: number;
    ingredients?: string[];
    steps?: string[];
    specialEquipment?: string[];
    notes?: string;
  };
}
