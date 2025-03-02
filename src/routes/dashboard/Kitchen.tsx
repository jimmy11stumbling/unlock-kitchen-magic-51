
import { KitchenDashboard } from "@/components/dashboard/kitchen/KitchenDashboard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KitchenAnalytics } from "@/components/dashboard/kitchen/KitchenAnalytics";
import { useKitchenState } from "@/hooks/dashboard/useKitchenState";

const Kitchen = () => {
  const { kitchenOrders } = useKitchenState();
  const [activeView, setActiveView] = useState<"dashboard" | "analytics">("dashboard");

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kitchen Management</h1>
        <div className="flex gap-4">
          <Button 
            variant={activeView === "dashboard" ? "default" : "outline"}
            onClick={() => setActiveView("dashboard")}
          >
            Dashboard
          </Button>
          <Button 
            variant={activeView === "analytics" ? "default" : "outline"}
            onClick={() => setActiveView("analytics")}
          >
            Analytics
          </Button>
        </div>
      </div>

      {activeView === "dashboard" ? (
        <KitchenDashboard />
      ) : (
        <div className="space-y-6">
          <KitchenAnalytics orders={kitchenOrders || []} />
          
          <Tabs defaultValue="daily">
            <TabsList className="w-full">
              <TabsTrigger value="daily">Daily Stats</TabsTrigger>
              <TabsTrigger value="weekly">Weekly Stats</TabsTrigger>
              <TabsTrigger value="monthly">Monthly Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Daily Order Volume</h3>
                  <div className="h-64 flex items-center justify-center bg-muted/20">
                    <p className="text-muted-foreground">Chart visualization would appear here</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Peak Hours</h3>
                  <div className="h-64 flex items-center justify-center bg-muted/20">
                    <p className="text-muted-foreground">Chart visualization would appear here</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="weekly" className="mt-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Weekly Performance</h3>
                <div className="h-64 flex items-center justify-center bg-muted/20">
                  <p className="text-muted-foreground">Weekly data visualizations would appear here</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="monthly" className="mt-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
                <div className="h-64 flex items-center justify-center bg-muted/20">
                  <p className="text-muted-foreground">Monthly data visualizations would appear here</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Kitchen;
