
import { AnalyticsPanel } from "@/components/dashboard/AnalyticsPanel";
import { useDashboardState } from "@/hooks/useDashboardState";

const Analytics = () => {
  const { salesData } = useDashboardState();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <AnalyticsPanel salesData={salesData} />
    </div>
  );
};

export default Analytics;
