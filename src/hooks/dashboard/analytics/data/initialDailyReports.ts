import type { DailyReport } from "@/types/staff";

export const initialDailyReports: DailyReport[] = [
  {
    id: 1,
    date: "2024-03-01",
    totalRevenue: 5800,
    totalOrders: 145,
    averageOrderValue: 40,
    topSellingItems: [
      { 
        id: 1,
        name: "Classic Burger",
        price: 14.99,
        category: "main",
        description: "Angus beef patty with lettuce, tomato, and special sauce",
        available: true,
        allergens: ["dairy", "gluten"],
        preparationTime: 15,
        orderCount: 45
      },
      {
        id: 4,
        name: "House Wine",
        price: 7.99,
        category: "beverage",
        description: "Glass of house red or white wine",
        available: true,
        allergens: ["sulfites"],
        preparationTime: 2,
        orderCount: 38
      },
      {
        id: 3,
        name: "Chocolate Lava Cake",
        price: 8.99,
        category: "dessert",
        description: "Warm chocolate cake with molten center",
        available: true,
        allergens: ["dairy", "eggs", "gluten"],
        preparationTime: 20,
        orderCount: 32
      }
    ],
    laborCosts: 1200,
    inventoryCosts: 2000,
    netProfit: 2600
  },
  {
    id: 2,
    date: "2024-03-22",
    totalRevenue: 5350.75,
    totalOrders: 178,
    averageOrderValue: 30.06,
    topSellingItems: [
      { 
        id: 2,
        name: "Margherita Pizza",
        price: 16.99,
        category: "main",
        description: "Fresh mozzarella, tomatoes, and basil",
        available: true,
        allergens: ["dairy", "gluten"],
        preparationTime: 18,
        orderCount: 52
      },
      {
        id: 5,
        name: "Craft Beer",
        price: 8.99,
        category: "beverage",
        description: "Selection of local craft beers",
        available: true,
        allergens: ["gluten"],
        preparationTime: 2,
        orderCount: 41
      },
      {
        id: 6,
        name: "Tiramisu",
        price: 9.99,
        category: "dessert",
        description: "Classic Italian dessert",
        available: true,
        allergens: ["dairy", "eggs", "gluten"],
        preparationTime: 5,
        orderCount: 35
      }
    ],
    laborCosts: 1337.69,
    inventoryCosts: 1070.15,
    netProfit: 2942.91
  },
  {
    id: 3,
    date: "2024-03-21",
    totalRevenue: 4890.80,
    totalOrders: 163,
    averageOrderValue: 30.00,
    topSellingItems: [
      { 
        id: 7,
        name: "Seafood Pasta",
        price: 22.99,
        category: "main",
        description: "Fresh seafood in white wine sauce",
        available: true,
        allergens: ["shellfish", "gluten"],
        preparationTime: 20,
        orderCount: 38
      },
      {
        id: 8,
        name: "Mojito",
        price: 11.99,
        category: "beverage",
        description: "Classic Cuban cocktail",
        available: true,
        allergens: [],
        preparationTime: 4,
        orderCount: 45
      },
      {
        id: 9,
        name: "Apple Pie",
        price: 7.99,
        category: "dessert",
        description: "Warm apple pie with vanilla ice cream",
        available: true,
        allergens: ["dairy", "gluten"],
        preparationTime: 8,
        orderCount: 29
      }
    ],
    laborCosts: 1222.70,
    inventoryCosts: 978.16,
    netProfit: 2689.94
  }
];
