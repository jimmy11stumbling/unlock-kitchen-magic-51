
import { ShoppingCart, PlusCircle, History, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersPanel } from "@/components/dashboard/OrdersPanel";
import { CreateOrderPanel } from "@/components/dashboard/orders/CreateOrderPanel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Order, KitchenOrder } from "@/types/staff";
import type { MenuItem } from "@/types/staff";

interface OrderTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentOrders: Order[];
  historyOrders: Order[];
  kitchenOrders: KitchenOrder[];
  menuItems: MenuItem[];
  updateOrderStatus: (orderId: number, status: Order["status"]) => Promise<void>;
  updateKitchenOrderStatus: (orderId: number, itemId: number, status: KitchenOrder["items"][0]["status"]) => Promise<void>;
  addOrder: (order: Omit<Order, "id">) => Promise<void>;
}

export function OrderTabs({
  activeTab,
  setActiveTab,
  currentOrders,
  historyOrders,
  kitchenOrders,
  menuItems,
  updateOrderStatus,
  updateKitchenOrderStatus,
  addOrder
}: OrderTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
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
  );
}
