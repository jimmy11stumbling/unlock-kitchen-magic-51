
import { useState } from "react";
import { OrdersPanel } from "@/components/dashboard/OrdersPanel";
import { CreateOrderPanel } from "@/components/dashboard/orders/CreateOrderPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInstantOrderProcessing } from "@/hooks/dashboard/orders/useInstantOrderProcessing";
import { useOrders } from "@/hooks/dashboard/orders/useOrders";
import { useKitchenOrders } from "@/hooks/dashboard/orders/useKitchenOrders";
import { useOrderActions } from "@/hooks/dashboard/orders/useOrderActions";
import { useMenuState } from "@/hooks/dashboard/useMenuState";
import { 
  AlertCircle, 
  RotateCcw, 
  ShoppingCart, 
  History, 
  PlusCircle 
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

  const currentOrders = orders.filter(order => 
    ["pending", "preparing", "ready"].includes(order.status)
  );

  const historyOrders = orders.filter(order => 
    order.status === "delivered"
  );

  return (
    <div className="container p-6 mx-auto">
      <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="current" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Current Orders
              {currentOrders.length > 0 && (
                <span className="ml-2 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                  {currentOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              New Order
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
              {historyOrders.length > 0 && (
                <span className="ml-2 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                  {historyOrders.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="current" className="space-y-4">
          {currentOrders.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Current Orders</AlertTitle>
              <AlertDescription>
                There are no active orders at the moment. Create a new order to get started.
              </AlertDescription>
            </Alert>
          ) : (
            <OrdersPanel
              orders={currentOrders}
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
          {historyOrders.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Order History</AlertTitle>
              <AlertDescription>
                No completed orders found in the history.
              </AlertDescription>
            </Alert>
          ) : (
            <OrdersPanel
              orders={historyOrders}
              kitchenOrders={kitchenOrders}
              onUpdateOrderStatus={updateOrderStatus}
              onUpdateKitchenOrderStatus={updateKitchenOrderStatus}
              isHistoryView={true}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
