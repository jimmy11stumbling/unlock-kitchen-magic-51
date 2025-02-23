
import { useState } from "react";
import type { SalesData, DailyReport, CustomerFeedback, Promotion } from "@/types/staff";

const initialSalesData: SalesData[] = [
  {
    date: "2024-03-01",
    revenue: 2450.75,
    costs: 1225.38,
    profit: 1225.37,
    orders: 82
  },
  {
    date: "2024-03-02",
    revenue: 3150.25,
    costs: 1575.13,
    profit: 1575.12,
    orders: 105
  },
  {
    date: "2024-03-03",
    revenue: 2875.50,
    costs: 1437.75,
    profit: 1437.75,
    orders: 96
  },
  {
    date: "2024-03-04",
    revenue: 2690.80,
    costs: 1345.40,
    profit: 1345.40,
    orders: 90
  }
];

const initialDailyReports: DailyReport[] = [{
  date: new Date().toISOString(),
  totalRevenue: 2875.50,
  totalOrders: 96,
  averageOrderValue: 29.95,
  topSellingItems: [
    { id: 1, name: "Classic Burger", orderCount: 32 },
    { id: 4, name: "House Wine", orderCount: 28 },
    { id: 3, name: "Chocolate Lava Cake", orderCount: 24 }
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

  const addSalesData = (data: Omit<SalesData, "profit">) => {
    const profit = data.revenue - data.costs;
    const newSalesData: SalesData = {
      ...data,
      profit,
    };
    setSalesData([...salesData, newSalesData]);
  };

  const resolveFeedback = (feedbackId: number) => {
    setFeedback(
      feedback.map((item) =>
        item.id === feedbackId ? { ...item, resolved: true } : item
      )
    );
  };

  const addPromotion = (promotionData: Omit<Promotion, "id">) => {
    const newPromotion: Promotion = {
      id: promotions.length + 1,
      ...promotionData,
    };
    setPromotions([...promotions, newPromotion]);
  };

  const togglePromotion = (promotionId: number) => {
    setPromotions(promotions.map(promo =>
      promo.id === promotionId
        ? { ...promo, active: !promo.active }
        : promo
    ));
  };

  return {
    salesData,
    dailyReports,
    feedback,
    promotions,
    addSalesData,
    resolveFeedback,
    addPromotion,
    togglePromotion,
  };
};
