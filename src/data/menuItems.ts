
import type { MenuItem } from "@/types/staff";

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Truffle Wagyu Burger",
    price: 24.99,
    category: "main",
    description: "Premium wagyu beef patty with truffle aioli",
    available: true,
    allergens: ["dairy", "gluten"],
    preparationTime: 20,
    orderCount: 0
  },
  {
    id: 2,
    name: "Mediterranean Quinoa Bowl",
    price: 18.99,
    category: "main",
    description: "Fresh quinoa with roasted vegetables and feta",
    available: true,
    allergens: ["dairy"],
    preparationTime: 15,
    orderCount: 0
  },
  {
    id: 3,
    name: "Lobster Bisque",
    price: 16.99,
    category: "appetizer",
    description: "Creamy lobster soup with cognac",
    available: true,
    allergens: ["shellfish", "dairy"],
    preparationTime: 12,
    orderCount: 0
  },
  {
    id: 4,
    name: "Tuna Tartare",
    price: 19.99,
    category: "appetizer",
    description: "Fresh tuna with avocado and wasabi aioli",
    available: true,
    allergens: ["fish"],
    preparationTime: 10,
    orderCount: 0
  },
  {
    id: 5,
    name: "Crème Brûlée",
    price: 12.99,
    category: "dessert",
    description: "Classic vanilla bean custard",
    available: true,
    allergens: ["dairy", "eggs"],
    preparationTime: 8,
    orderCount: 0
  },
  {
    id: 6,
    name: "Signature Martini",
    price: 15.99,
    category: "beverage",
    description: "House special martini with blue curaçao",
    available: true,
    allergens: [],
    preparationTime: 5,
    orderCount: 0
  },
  {
    id: 7,
    name: "Seafood Paella",
    price: 34.99,
    category: "main",
    description: "Traditional Spanish rice with mixed seafood",
    available: true,
    allergens: ["shellfish", "fish"],
    preparationTime: 30,
    orderCount: 0
  },
  {
    id: 8,
    name: "Chocolate Soufflé",
    price: 14.99,
    category: "dessert",
    description: "Warm chocolate soufflé with vanilla ice cream",
    available: true,
    allergens: ["dairy", "eggs", "gluten"],
    preparationTime: 20,
    orderCount: 0
  }
];
