
import { KitchenDisplay } from "@/components/dashboard/KitchenDisplay";
import { useDashboardState } from "@/hooks/useDashboardState";

const Kitchen = () => {
  const { kitchenOrders, menuItems, updateKitchenOrderStatus } = useDashboardState();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Kitchen Display</h1>
      <KitchenDisplay
        kitchenOrders={kitchenOrders}
        menuItems={menuItems}
        onUpdateOrderStatus={updateKitchenOrderStatus}
      />
    </div>
  );
};

export default Kitchen;
