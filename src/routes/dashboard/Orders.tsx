
import { OrdersPanel } from "@/components/dashboard/OrdersPanel";
import { useDashboardState } from "@/hooks/useDashboardState";

const Orders = () => {
  const { orders, updateOrderStatus } = useDashboardState();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Orders</h1>
      <OrdersPanel 
        orders={orders}
        updateOrderStatus={updateOrderStatus}
      />
    </div>
  );
};

export default Orders;
