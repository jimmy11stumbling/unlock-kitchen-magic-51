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
  PlusCircle,
  ChevronDown,
  DollarSign,
  BarChart
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("current");
  const { orders, isLoading: ordersLoading, error: ordersError } = useOrders();
  const { kitchenOrders, isLoading: kitchenLoading, error: kitchenError } = useKitchenOrders();
  const { addOrder, updateOrderStatus, updateKitchenOrderStatus } = useOrderActions(kitchenOrders);
  const { menuItems, isLoading: menuLoading, error: menuError } = useMenuState();
  const { toast } = useToast();

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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img 
              src="/placeholder.svg" 
              alt="Logo" 
              className="h-10 w-10"
            />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              OrderFlow Pro
            </h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Quick Actions
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setActiveTab("new")}>
                <PlusCircle className="w-4 h-4 mr-2" />
                New Order
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ 
                title: "Generating report...",
                description: "Your report will be ready in a few moments."
              })}>
                <BarChart className="w-4 h-4 mr-2" />
                Generate Report
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveTab("history")}>
                <History className="w-4 h-4 mr-2" />
                View History
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <h3 className="text-2xl font-bold">{metrics.totalOrders}</h3>
              </div>
              <ShoppingCart className="h-8 w-8 text-primary/20" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold">${metrics.totalRevenue.toFixed(2)}</h3>
              </div>
              <DollarSign className="h-8 w-8 text-primary/20" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Order Value</p>
                <h3 className="text-2xl font-bold">${metrics.avgOrderValue.toFixed(2)}</h3>
              </div>
              <BarChart className="h-8 w-8 text-primary/20" />
            </div>
          </Card>
        </div>
      </div>

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
