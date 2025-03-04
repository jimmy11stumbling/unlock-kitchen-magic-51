
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Clock, Check, AlertTriangle, Timer } from "lucide-react";
import type { KitchenOrder } from "@/types/staff";

export interface KitchenLayoutProps {
  orders: KitchenOrder[];
  onOrderUpdate?: (orderId: number, status: string) => void;
  onItemUpdate?: (orderId: number, itemId: number, status: string) => void;
}

export const KitchenLayout = ({ orders, onOrderUpdate, onItemUpdate }: KitchenLayoutProps) => {
  const [activeView, setActiveView] = useState<"all" | "new" | "in-progress" | "ready">("all");
  const [orderTimers, setOrderTimers] = useState<Record<number, number>>({});

  // Initialize and update timers for orders
  useEffect(() => {
    const interval = setInterval(() => {
      setOrderTimers(prev => {
        const newTimers = { ...prev };
        orders.forEach(order => {
          if (order.status !== "completed" && order.status !== "cancelled") {
            const orderId = order.id;
            const orderTime = new Date(order.timestamp).getTime();
            const currentTime = new Date().getTime();
            const elapsedSeconds = Math.floor((currentTime - orderTime) / 1000);
            newTimers[orderId] = elapsedSeconds;
          }
        });
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [orders]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getAlertClass = (timeElapsed: number, estimatedTime: number): string => {
    const timeRatio = timeElapsed / (estimatedTime * 60);
    if (timeRatio > 1.2) return "text-red-500";
    if (timeRatio > 0.8) return "text-amber-500";
    return "text-green-500";
  };

  const filteredOrders = orders.filter(order => {
    switch (activeView) {
      case "new": return order.status === "new";
      case "in-progress": return order.status === "in-progress";
      case "ready": return order.status === "ready";
      default: return true;
    }
  });

  return (
    <div className="flex flex-col h-full">
      <div className="bg-background p-4 border-b">
        <h1 className="text-2xl font-bold">Kitchen Display System</h1>
        <p className="text-muted-foreground">Manage and track orders in real-time</p>
      </div>

      <Tabs defaultValue="all" value={activeView} onValueChange={(v) => setActiveView(v as any)} className="flex-1">
        <div className="p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="ready">Ready</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeView} className="flex-1 p-4">
          <ScrollArea className="h-[calc(100vh-230px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <Card key={order.id} className={`
                    ${order.status === "new" ? "border-blue-400" : ""}
                    ${order.status === "in-progress" ? "border-amber-400" : ""}
                    ${order.status === "ready" ? "border-green-400" : ""}
                    ${order.status === "completed" ? "border-gray-400 opacity-70" : ""}
                    shadow-md transition-all duration-200 hover:shadow-lg
                  `}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Order #{order.id}</CardTitle>
                          <CardDescription>Table {order.tableNumber}</CardDescription>
                        </div>
                        <Badge variant={
                          order.status === "new" ? "default" :
                          order.status === "in-progress" ? "secondary" :
                          order.status === "ready" ? "success" : "outline"
                        }>
                          {order.status.replace("-", " ")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span className={getAlertClass(orderTimers[order.id] || 0, order.estimatedPrepTime)}>
                            {formatTime(orderTimers[order.id] || 0)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Timer className="h-4 w-4" />
                          <span>Est: {order.estimatedPrepTime} min</span>
                        </div>
                      </div>

                      <Separator className="my-2" />

                      <div className="space-y-2 mt-2">
                        {order.items.map((item, idx) => (
                          <div 
                            key={idx} 
                            className={`
                              p-2 rounded border 
                              ${item.status === "pending" ? "bg-background border-blue-200" : ""}
                              ${item.status === "cooking" ? "bg-amber-50 border-amber-200" : ""}
                              ${item.status === "ready" ? "bg-green-50 border-green-200" : ""}
                              ${item.status === "cancelled" ? "bg-red-50 border-red-200" : ""}
                            `}
                          >
                            <div className="flex justify-between">
                              <span className="font-medium">{item.name}</span>
                              <Badge variant="outline">{item.status}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Qty: {item.quantity}
                            </div>
                            {item.modifications && item.modifications.length > 0 && (
                              <div className="mt-1 text-sm italic">
                                {item.modifications.join(", ")}
                              </div>
                            )}
                            {item.status !== "ready" && item.status !== "cancelled" && (
                              <div className="grid grid-cols-2 gap-1 mt-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => onItemUpdate?.(order.id, idx, item.status === "pending" ? "cooking" : "ready")}
                                >
                                  {item.status === "pending" ? "Start" : "Ready"}
                                </Button>
                                <Button 
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                  onClick={() => onItemUpdate?.(order.id, idx, "cancelled")}
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}

                        {order.specialInstructions && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium">Special Instructions:</span>
                            </div>
                            <p className="text-sm mt-1">{order.specialInstructions}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 flex gap-2">
                      {order.status === "new" && (
                        <Button 
                          className="flex-1" 
                          onClick={() => onOrderUpdate?.(order.id, "in-progress")}
                        >
                          Start Order
                        </Button>
                      )}
                      {order.status === "in-progress" && (
                        <Button 
                          className="flex-1" 
                          onClick={() => onOrderUpdate?.(order.id, "ready")}
                        >
                          Order Ready
                        </Button>
                      )}
                      {order.status === "ready" && (
                        <Button 
                          className="flex-1" 
                          variant="ghost"
                          onClick={() => onOrderUpdate?.(order.id, "completed")}
                        >
                          <Check className="h-4 w-4 mr-1" /> Complete
                        </Button>
                      )}
                      {onOrderUpdate && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => onOrderUpdate(order.id, "cancelled")}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                    <CheckIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No orders</h3>
                  <p className="text-muted-foreground">
                    There are no {activeView === "all" ? "current" : activeView} orders to display
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const X = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
