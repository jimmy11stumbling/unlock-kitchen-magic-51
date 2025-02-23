
import { useState } from "react";
import type { SalesData, DailyReport, CustomerFeedback, Promotion } from "@/types/staff";

export const useAnalyticsState = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([{
    date: new Date().toISOString(),
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topSellingItems: [],
    laborCosts: 0,
    inventoryCosts: 0,
    netProfit: 0,
  }]);
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
