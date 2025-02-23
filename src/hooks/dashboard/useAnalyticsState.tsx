
import { useState } from "react";
import type { SalesData, DailyReport, CustomerFeedback, Promotion } from "@/types/staff";

const initialSalesData: SalesData[] = [
  {
    date: "2024-03-01",
    revenue: 2450.75,
    costs: 1225.38,
    profit: 1225.37
  },
  {
    date: "2024-03-02",
    revenue: 3150.25,
    costs: 1575.13,
    profit: 1575.12
  },
  {
    date: "2024-03-03",
    revenue: 2875.50,
    costs: 1437.75,
    profit: 1437.75
  },
  {
    date: "2024-03-04",
    revenue: 2690.80,
    costs: 1345.40,
    profit: 1345.40
  }
];

const initialDailyReports: DailyReport[] = [{
  date: new Date().toISOString(),
  totalRevenue: 2875.50,
  totalOrders: 96,
  averageOrderValue: 29.95,
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
      orderCount: 32
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
      orderCount: 28
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
      orderCount: 24
    }
  ],
  laborCosts: 850.25,
  inventoryCosts: 587.50,
  netProfit: 1437.75,
}];

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
