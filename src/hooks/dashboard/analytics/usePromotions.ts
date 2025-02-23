
import { useState } from "react";
import type { Promotion } from "@/types/staff";

export const usePromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [error, setError] = useState<string | null>(null);

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
    promotions,
    error,
    addPromotion,
    togglePromotion,
  };
};
