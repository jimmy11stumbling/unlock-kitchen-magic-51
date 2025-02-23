
import { DailyReportsPanel } from "@/components/dashboard/DailyReportsPanel";
import { useDashboardState } from "@/hooks/useDashboardState";

const DailyReports = () => {
  const { dailyReports } = useDashboardState();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Daily Reports</h1>
      <DailyReportsPanel reports={dailyReports} />
    </div>
  );
};

export default DailyReports;
