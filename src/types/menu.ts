
export type MenuCategory = "appetizer" | "main" | "dessert" | "beverage";

export interface IngredientRequirement {
  ingredientId: number;
  quantity: number;
  unit: string;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: MenuCategory;
  description: string;
  available: boolean;
  image?: string;
  allergens: string[];
  preparationTime: number;
  orderCount: number;
  ingredientRequirements?: IngredientRequirement[];
  prepDetails?: {
    steps: string[];
    equipmentNeeded: string[];
  };
}
