
export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: "appetizer" | "main" | "dessert" | "beverage";
  description: string;
  available: boolean;
  image?: string;
  allergens: string[];
  preparationTime: number;
  orderCount?: number;
}
