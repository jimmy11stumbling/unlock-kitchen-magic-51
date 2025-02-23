
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { useDashboardState } from "@/hooks/useDashboardState";

const Overview = () => {
  const { salesData, staff, orders } = useDashboardState();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Overview</h1>
      <DashboardOverview 
        salesData={salesData}
        staff={staff}
        orders={orders}
      />
    </div>
  );
};

export default Overview;
