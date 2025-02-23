
import { useState } from "react";
import { OrdersPanel } from "@/components/dashboard/OrdersPanel";
import { CreateOrderPanel } from "@/components/dashboard/orders/CreateOrderPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInstantOrderProcessing } from "@/hooks/dashboard/orders/useInstantOrderProcessing";
import { useOrders } from "@/hooks/dashboard/orders/useOrders";
import { useKitchenOrders } from "@/hooks/dashboard/orders/useKitchenOrders";
import { useOrderActions } from "@/hooks/dashboard/orders/useOrderActions";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("current");
  const { orders, isLoading: ordersLoading } = useOrders();
  const { kitchenOrders, isLoading: kitchenLoading } = useKitchenOrders();
  const { addOrder, updateOrderStatus, updateKitchenOrderStatus } = useOrderActions(kitchenOrders);

  // Initialize instant order processing
  useInstantOrderProcessing();

  if (ordersLoading || kitchenLoading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-8 bg-muted rounded w-1/4 animate-pulse"></div>
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
        </div>
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
          <CreateOrderPanel onAddOrder={addOrder} />
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
