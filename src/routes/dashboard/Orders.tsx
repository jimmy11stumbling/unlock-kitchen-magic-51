
import { useState } from "react";
import { OrdersPanel } from "@/components/dashboard/OrdersPanel";
import { CreateOrderPanel } from "@/components/dashboard/orders/CreateOrderPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInstantOrderProcessing } from "@/hooks/dashboard/orders/useInstantOrderProcessing";
import { useOrders } from "@/hooks/dashboard/orders/useOrders";
import { useKitchenOrders } from "@/hooks/dashboard/orders/useKitchenOrders";
import { useOrderActions } from "@/hooks/dashboard/orders/useOrderActions";
import { useMenuState } from "@/hooks/dashboard/useMenuState";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("current");
  const { orders, isLoading: ordersLoading, error: ordersError } = useOrders();
  const { kitchenOrders, isLoading: kitchenLoading, error: kitchenError } = useKitchenOrders();
  const { addOrder, updateOrderStatus, updateKitchenOrderStatus } = useOrderActions(kitchenOrders);
  const { menuItems, isLoading: menuLoading } = useMenuState();

  useInstantOrderProcessing();

  if (ordersLoading || kitchenLoading || menuLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  const error = ordersError || kitchenError;
  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container p-6 mx-auto">
      <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="current">Current Orders</TabsTrigger>
            <TabsTrigger value="new">New Order</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="current" className="space-y-4">
          {orders.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Current Orders</AlertTitle>
              <AlertDescription>
                There are no active orders at the moment. Create a new order to get started.
              </AlertDescription>
            </Alert>
          ) : (
            <OrdersPanel
              orders={orders.filter(order => 
                ["pending", "preparing", "ready"].includes(order.status)
              )}
              kitchenOrders={kitchenOrders}
              onUpdateOrderStatus={updateOrderStatus}
              onUpdateKitchenOrderStatus={updateKitchenOrderStatus}
            />
          )}
        </TabsContent>

        <TabsContent value="new">
          <CreateOrderPanel 
            onCreateOrder={addOrder}
            menuItems={menuItems}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <OrdersPanel
            orders={orders.filter(order => order.status === "delivered")}
            kitchenOrders={kitchenOrders}
            onUpdateOrderStatus={updateOrderStatus}
            onUpdateKitchenOrderStatus={updateKitchenOrderStatus}
            isHistoryView={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
