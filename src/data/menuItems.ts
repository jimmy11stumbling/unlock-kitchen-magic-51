
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
  // ... Add other menu items as needed
];
