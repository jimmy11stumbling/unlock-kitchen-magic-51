
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { useDashboardState } from "@/hooks/useDashboardState";
import { TestingPanel } from "@/components/dashboard/TestingPanel";

const Overview = () => {
  const { salesData, staff, orders, menuItems, reservations, inventory } = useDashboardState();

  return (
    <div className="space-y-8">
      <DashboardOverview 
        salesData={salesData}
        staff={staff}
        orders={orders}
        menuItems={menuItems}
        reservations={reservations}
        inventory={inventory}
      />
      <TestingPanel />
    </div>
  );
};

export default Overview;
