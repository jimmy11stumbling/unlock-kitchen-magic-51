
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { KitchenLayout } from "@/components/kitchen/KitchenLayout";
import { useKitchenOrders } from "@/hooks/useKitchenOrders";
import { BarChart, LineChart, Clock, AlertCircle, Settings, Thermometer, Tool } from "lucide-react";

export default function Kitchen() {
  const { orders, isLoading, updateOrderStatus, updateItemStatus, refreshOrders } = useKitchenOrders();
  const [activeTab, setActiveTab] = useState("orders");
  const { toast } = useToast();
  
  const activeOrders = orders.filter(order => 
    order.status !== "completed" && order.status !== "cancelled"
  );

  const equipmentStatus = [
    { name: "Main Grill", status: "operational", lastMaintenance: "2023-10-15" },
    { name: "Walk-in Refrigerator", status: "operational", lastMaintenance: "2023-09-22" },
    { name: "Fryer #1", status: "needs-attention", lastMaintenance: "2023-08-05" },
    { name: "Dishwasher", status: "operational", lastMaintenance: "2023-11-01" },
    { name: "Oven #2", status: "down", lastMaintenance: "2023-06-10" }
  ];

  const temperatureReadings = [
    { location: "Walk-in Cooler", current: 38, min: 33, max: 40 },
    { location: "Freezer", current: 2, min: 0, max: 10 },
    { location: "Hot Hold Cabinet", current: 142, min: 135, max: 165 },
    { location: "Prep Area", current: 68, min: 65, max: 75 }
  ];

  const criticalIngredients = [
    { name: "Fresh Salmon", quantity: 3, unit: "lbs", threshold: 5 },
    { name: "Heavy Cream", quantity: 1, unit: "pt", threshold: 2 },
    { name: "Beef Tenderloin", quantity: 8, unit: "lbs", threshold: 10 }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Kitchen Management</h1>
          <p className="text-muted-foreground">Monitor and manage kitchen operations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refreshOrders}>
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">
            Orders
          </TabsTrigger>
          <TabsTrigger value="equipment">
            Equipment
          </TabsTrigger>
          <TabsTrigger value="temperature">
            Temperature
          </TabsTrigger>
          <TabsTrigger value="inventory">
            Critical Inventory
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="flex-1">
          <KitchenLayout 
            orders={activeOrders} 
            onOrderUpdate={updateOrderStatus}
            onItemUpdate={updateItemStatus}
          />
        </TabsContent>

        <TabsContent value="equipment">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {equipmentStatus.map((equipment) => (
              <Card key={equipment.name} className={`
                ${equipment.status === "operational" ? "border-green-200" : ""}
                ${equipment.status === "needs-attention" ? "border-amber-200" : ""}
                ${equipment.status === "down" ? "border-red-200" : ""}
              `}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tool className="h-5 w-5" />
                    {equipment.name}
                  </CardTitle>
                  <CardDescription>
                    Last maintenance: {new Date(equipment.lastMaintenance).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full 
                      ${equipment.status === "operational" ? "bg-green-500" : ""}
                      ${equipment.status === "needs-attention" ? "bg-amber-500" : ""}
                      ${equipment.status === "down" ? "bg-red-500" : ""}
                    `}></div>
                    <span className="capitalize">{equipment.status.replace("-", " ")}</span>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Maintenance Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="temperature">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {temperatureReadings.map((reading) => {
                const isOutOfRange = reading.current < reading.min || reading.current > reading.max;
                return (
                  <Card key={reading.location} className={`
                    ${isOutOfRange ? "border-red-200" : "border-green-200"}
                  `}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{reading.location}</CardTitle>
                      <CardDescription>
                        Safe range: {reading.min}°F - {reading.max}°F
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Thermometer className={`h-5 w-5 ${isOutOfRange ? "text-red-500" : "text-green-500"}`} />
                          <span className={`text-2xl font-bold ${isOutOfRange ? "text-red-500" : "text-green-500"}`}>
                            {reading.current}°F
                          </span>
                        </div>
                        {isOutOfRange && (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Temperature History</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  <LineChart className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Temperature chart</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Critical Ingredients</CardTitle>
                  <CardDescription>Items requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {criticalIngredients.map((ingredient) => (
                      <div key={ingredient.name} className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{ingredient.name}</h4>
                          <div className="text-sm text-muted-foreground">
                            Current: {ingredient.quantity} {ingredient.unit} 
                            (Threshold: {ingredient.threshold} {ingredient.unit})
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                ingredient.quantity / ingredient.threshold < 0.25 ? "bg-red-500" : 
                                ingredient.quantity / ingredient.threshold < 0.5 ? "bg-amber-500" : 
                                "bg-green-500"
                              }`}
                              style={{ width: `${Math.min((ingredient.quantity / ingredient.threshold) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <Button size="sm" variant="outline">Order</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Usage Trends</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
                  <BarChart className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Usage chart</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
