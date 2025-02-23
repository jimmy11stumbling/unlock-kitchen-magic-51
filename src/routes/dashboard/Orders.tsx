
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersPanel } from "@/components/dashboard/OrdersPanel";
import { CreateOrderPanel } from "@/components/dashboard/orders/CreateOrderPanel";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useInstantOrderProcessing } from "@/hooks/dashboard/orders/useInstantOrderProcessing";

const Orders = () => {
  const { orders, menuItems, addOrder, updateOrderStatus } = useDashboardState();
  const [activeTab, setActiveTab] = useState<"create" | "manage">("create");
  
  // Initialize instant order processing
  useInstantOrderProcessing();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Orders</h1>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "create" | "manage")}>
        <TabsList>
          <TabsTrigger value="create">Create Order</TabsTrigger>
          <TabsTrigger value="manage">Manage Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="mt-6">
          <CreateOrderPanel
            menuItems={menuItems}
            onCreateOrder={addOrder}
          />
        </TabsContent>
        
        <TabsContent value="manage" className="mt-6">
          <OrdersPanel 
            orders={orders}
            updateOrderStatus={updateOrderStatus}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Orders;
