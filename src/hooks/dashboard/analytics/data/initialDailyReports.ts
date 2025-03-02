import type { DailyReport } from "@/types/staff";

export const initialDailyReports: DailyReport[] = [
  {
    id: 1,
    date: "2023-06-01",
    totalRevenue: 4780.45,
    totalOrders: 156,
    averageOrderValue: 30.64,
    topSellingItems: [
      {
        id: 1,
        name: "Classic Burger",
        category: "main",
        price: 14.99,
        orderCount: 48,
        description: "Angus beef patty with lettuce, tomato, and special sauce"
      },
      {
        id: 4,
        name: "House Wine",
        price: 7.99,
        category: "beverage",
        description: "Glass of house red or white wine",
        orderCount: 38
      },
      {
        id: 3,
        name: "Chocolate Lava Cake",
        price: 8.99,
        category: "dessert",
        description: "Warm chocolate cake with molten center",
        orderCount: 32
      }
    ],
    laborCosts: 1200.00,
    inventoryCosts: 1650.25,
    netProfit: 1930.20
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
        orderCount: 52
      },
      {
        id: 5,
        name: "Craft Beer",
        price: 8.99,
        category: "beverage",
        description: "Selection of local craft beers",
        orderCount: 41
      },
      {
        id: 6,
        name: "Tiramisu",
        price: 9.99,
        category: "dessert",
        description: "Classic Italian dessert",
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
        orderCount: 38
      },
      {
        id: 8,
        name: "Mojito",
        price: 11.99,
        category: "beverage",
        description: "Classic Cuban cocktail",
        orderCount: 45
      },
      {
        id: 9,
        name: "Apple Pie",
        price: 7.99,
        category: "dessert",
        description: "Warm apple pie with vanilla ice cream",
        orderCount: 29
      }
    ],
    laborCosts: 1222.70,
    inventoryCosts: 978.16,
    netProfit: 2689.94
  }
];
