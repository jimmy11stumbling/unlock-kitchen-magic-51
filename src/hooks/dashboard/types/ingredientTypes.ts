
export interface Ingredient {
  id: number;
  name: string;
  current_stock: number;
  unit: string;
  minimum_stock: number;
  cost_per_unit: number;
}

export interface MenuItemIngredient {
  id: number;
  menu_item_id: number;
  ingredient_id: number;
  quantity: number;
  unit: string;
  ingredients?: Ingredient;
}

export interface MenuItemIngredientJoin {
  quantity: number;
  ingredient_id: number;
  ingredients: Ingredient;
}

export interface PrepDetails {
  steps: Array<{ duration: number }>;
  equipment_needed: string[];
}

export interface RealtimePayload {
  commit_timestamp: string;
  errors: null | any[];
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: { [key: string]: any };
  old: { [key: string]: any };
  schema: string;
  table: string;
}
