
import { useState } from "react";
import type { SalesData, DailyReport, CustomerFeedback, Promotion } from "@/types/staff";

const initialSalesData: SalesData[] = [
  {
    date: "2024-01-01",
    revenue: 3250.75,
    costs: 1625.38,
    profit: 1625.37
  },
  {
    date: "2024-01-15",
    revenue: 4150.25,
    costs: 2075.13,
    profit: 2075.12
  },
  {
    date: "2024-02-01",
    revenue: 3875.50,
    costs: 1937.75,
    profit: 1937.75
  },
  {
    date: "2024-02-15",
    revenue: 4590.80,
    costs: 2295.40,
    profit: 2295.40
  },
  {
    date: "2024-03-01",
    revenue: 5250.75,
    costs: 2625.38,
    profit: 2625.37
  },
  {
    date: "2024-03-15",
    revenue: 4850.25,
    costs: 2425.13,
    profit: 2425.12
  },
  {
    date: "2024-03-20",
    revenue: 5175.50,
    costs: 2587.75,
    profit: 2587.75
  },
  {
    date: "2024-03-21",
    revenue: 4890.80,
    costs: 2445.40,
    profit: 2445.40
  },
  {
    date: "2024-03-22",
    revenue: 5350.75,
    costs: 2675.38,
    profit: 2675.37
  },
  {
    date: "2024-03-23",
    revenue: 4950.25,
    costs: 2475.13,
    profit: 2475.12
  }
];

const initialDailyReports: DailyReport[] = [
  {
    date: "2024-03-23",
    totalRevenue: 4950.25,
    totalOrders: 165,
    averageOrderValue: 30.00,
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
    laborCosts: 1250.25,
    inventoryCosts: 987.50,
    netProfit: 2475.12,
  },
  {
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
    netProfit: 2675.37,
  },
  {
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
    netProfit: 2445.40,
  }
];

export const useAnalyticsState = () => {
  const [salesData, setSalesData] = useState<SalesData[]>(initialSalesData);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>(initialDailyReports);
  const [feedback, setFeedback] = useState<CustomerFeedback[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addSalesData = (data: Omit<SalesData, "profit">) => {
    try {
      const profit = data.revenue - data.costs;
      const newSalesData: SalesData = {
        ...data,
        profit,
      };
      setSalesData([...salesData, newSalesData]);
    } catch (err) {
      setError("Failed to add sales data");
      throw err;
    }
  };

  const resolveFeedback = (feedbackId: number) => {
    try {
      setFeedback(
        feedback.map((item) =>
          item.id === feedbackId ? { ...item, resolved: true } : item
        )
      );
    } catch (err) {
      setError("Failed to resolve feedback");
      throw err;
    }
  };

  const addPromotion = (promotionData: Omit<Promotion, "id">) => {
    try {
      const newPromotion: Promotion = {
        id: promotions.length + 1,
        ...promotionData,
      };
      setPromotions([...promotions, newPromotion]);
    } catch (err) {
      setError("Failed to add promotion");
      throw err;
    }
  };

  const togglePromotion = (promotionId: number) => {
    try {
      setPromotions(promotions.map(promo =>
        promo.id === promotionId
          ? { ...promo, active: !promo.active }
          : promo
      ));
    } catch (err) {
      setError("Failed to toggle promotion");
      throw err;
    }
  };

  return {
    salesData,
    dailyReports,
    feedback,
    promotions,
    error,
    addSalesData,
    resolveFeedback,
    addPromotion,
    togglePromotion,
  };
};
