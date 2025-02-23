
import { useState } from "react";
import { useInstantOrderProcessing } from "@/hooks/dashboard/orders/useInstantOrderProcessing";
import { useOrders } from "@/hooks/dashboard/orders/useOrders";
import { useKitchenOrders } from "@/hooks/dashboard/orders/useKitchenOrders";
import { useOrderActions } from "@/hooks/dashboard/orders/useOrderActions";
import { useMenuState } from "@/hooks/dashboard/useMenuState";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderHeader } from "@/components/dashboard/orders/page/OrderHeader";
import { OrderMetrics } from "@/components/dashboard/orders/page/OrderMetrics";
import { OrderTabs } from "@/components/dashboard/orders/page/OrderTabs";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("current");
  const { orders, isLoading: ordersLoading, error: ordersError } = useOrders();
  const { kitchenOrders, isLoading: kitchenLoading, error: kitchenError } = useKitchenOrders();
  const { addOrder, updateOrderStatus, updateKitchenOrderStatus } = useOrderActions(kitchenOrders);
  const { menuItems, isLoading: menuLoading, error: menuError } = useMenuState();

  useInstantOrderProcessing();

  const handleRetry = () => {
    window.location.reload();
  };

  const calculateOrderMetrics = () => {
    if (!orders || orders.length === 0) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        avgOrderValue: 0
      };
    }

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
      const total = typeof order.total === 'string' ? parseFloat(order.total) : order.total;
      return sum + (isNaN(total) ? 0 : total);
    }, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      totalRevenue,
      avgOrderValue
    };
  };

  if (ordersLoading || kitchenLoading || menuLoading) {
    return (
      <div className="p-8 space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const error = ordersError || kitchenError || menuError;
  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Orders</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>{error}</p>
            <Button
              variant="outline"
              onClick={handleRetry}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentOrders = orders?.filter(order => 
    ["pending", "preparing", "ready"].includes(order?.status || '')
  ) || [];

  const historyOrders = orders?.filter(order => 
    order?.status === "delivered"
  ) || [];

  const metrics = calculateOrderMetrics();

  return (
    <div className="container p-6 mx-auto">
      <div className="mb-8">
        <OrderHeader setActiveTab={setActiveTab} />
        <OrderMetrics metrics={metrics} />
      </div>
      
      <OrderTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentOrders={currentOrders}
        historyOrders={historyOrders}
        kitchenOrders={kitchenOrders}
        menuItems={menuItems}
        updateOrderStatus={updateOrderStatus}
        updateKitchenOrderStatus={updateKitchenOrderStatus}
        addOrder={addOrder}
      />
    </div>
  );
}
