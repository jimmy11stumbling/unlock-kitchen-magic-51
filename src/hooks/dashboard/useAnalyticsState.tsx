
import { useSalesAnalytics } from "./analytics/useSalesAnalytics";
import { useDailyReports } from "./analytics/useDailyReports";
import { usePromotions } from "./analytics/usePromotions";
import { useFeedback } from "./analytics/useFeedback";

export const useAnalyticsState = () => {
  const { salesData, error: salesError, addSalesData } = useSalesAnalytics();
  const { dailyReports, error: reportsError } = useDailyReports();
  const { promotions, error: promotionsError, addPromotion, togglePromotion } = usePromotions();
  const { feedback, error: feedbackError, resolveFeedback } = useFeedback();

  const error = salesError || reportsError || promotionsError || feedbackError;

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
