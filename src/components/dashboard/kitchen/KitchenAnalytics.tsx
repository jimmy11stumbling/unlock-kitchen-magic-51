
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, CheckCircle, Server } from "lucide-react";
import { useMemo } from "react";
import type { KitchenOrder } from "@/types/staff";

interface KitchenAnalyticsProps {
  orders: KitchenOrder[];
}

export function KitchenAnalytics({ orders }: KitchenAnalyticsProps) {
  const analytics = useMemo(() => {
    // Calculate average preparation time
    const completedOrders = orders.filter(order => 
      order.status === "delivered" || order.status === "ready"
    );
    
    const preparationTimes = completedOrders.map(order => {
      const startTime = new Date(order.created_at).getTime();
      const endTime = order.items.some(item => item.completion_time) 
        ? Math.max(...order.items
            .filter(item => item.completion_time)
            .map(item => new Date(item.completion_time || "").getTime())
          )
        : new Date(order.updated_at).getTime();
      
      return (endTime - startTime) / (1000 * 60); // in minutes
    });
    
    const avgPrepTime = preparationTimes.length 
      ? Math.round(preparationTimes.reduce((sum, time) => sum + time, 0) / preparationTimes.length) 
      : 0;
    
    // Calculate on-time delivery rate
    const onTimeOrders = completedOrders.filter(order => {
      const completionTime = new Date(order.updated_at).getTime();
      const estimatedTime = new Date(order.estimated_delivery_time).getTime();
      return completionTime <= estimatedTime;
    });
    
    const onTimeRate = completedOrders.length 
      ? Math.round((onTimeOrders.length / completedOrders.length) * 100) 
      : 0;
    
    // Calculate station efficiency
    const stationItems = orders.flatMap(order => 
      order.items.map(item => ({ 
        station: item.cooking_station || "unknown",
        status: item.status,
        prepTime: item.start_time && item.completion_time 
          ? (new Date(item.completion_time).getTime() - new Date(item.start_time).getTime()) / (1000 * 60)
          : null
      }))
    );
    
    const stationStats = Object.entries(
      stationItems.reduce((acc, { station, status, prepTime }) => {
        if (!acc[station]) {
          acc[station] = { total: 0, completed: 0, totalPrepTime: 0, prepTimeCount: 0 };
        }
        
        acc[station].total++;
        if (status === "ready" || status === "delivered") {
          acc[station].completed++;
        }
        
        if (prepTime !== null) {
          acc[station].totalPrepTime += prepTime;
          acc[station].prepTimeCount++;
        }
        
        return acc;
      }, {} as Record<string, { total: number; completed: number; totalPrepTime: number; prepTimeCount: number }>)
    ).map(([station, stats]) => ({
      station,
      efficiency: stats.total ? Math.round((stats.completed / stats.total) * 100) : 0,
      avgPrepTime: stats.prepTimeCount ? Math.round(stats.totalPrepTime / stats.prepTimeCount) : 0
    }));
    
    return {
      avgPrepTime,
      onTimeRate,
      stationStats,
      pendingOrders: orders.filter(o => o.status === "pending").length,
      preparingOrders: orders.filter(o => o.status === "preparing").length,
      readyOrders: orders.filter(o => o.status === "ready").length,
      deliveredOrders: orders.filter(o => o.status === "delivered").length,
    };
  }, [orders]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Kitchen Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stations">Stations</TabsTrigger>
            <TabsTrigger value="timing">Timing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Avg. Prep Time</p>
                    <p className="text-2xl font-bold">{analytics.avgPrepTime} min</p>
                  </div>
                  <Clock className="h-10 w-10 text-primary/20" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">On-Time Rate</p>
                    <p className="text-2xl font-bold">{analytics.onTimeRate}%</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-primary/20" />
                </div>
              </Card>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2 bg-yellow-100 text-yellow-800 rounded">
                <p className="text-xs font-medium">Pending</p>
                <p className="text-xl font-bold">{analytics.pendingOrders}</p>
              </div>
              <div className="p-2 bg-blue-100 text-blue-800 rounded">
                <p className="text-xs font-medium">Preparing</p>
                <p className="text-xl font-bold">{analytics.preparingOrders}</p>
              </div>
              <div className="p-2 bg-green-100 text-green-800 rounded">
                <p className="text-xs font-medium">Ready</p>
                <p className="text-xl font-bold">{analytics.readyOrders}</p>
              </div>
              <div className="p-2 bg-gray-100 text-gray-800 rounded">
                <p className="text-xs font-medium">Delivered</p>
                <p className="text-xl font-bold">{analytics.deliveredOrders}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stations">
            <div className="space-y-3">
              {analytics.stationStats.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No station data available</p>
              ) : (
                analytics.stationStats.map(station => (
                  <div key={station.station} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium capitalize">{station.station}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={station.efficiency > 75 ? "default" : 
                                station.efficiency > 50 ? "outline" : "destructive"}
                      >
                        {station.efficiency}% Efficient
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {station.avgPrepTime} min avg
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="timing">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">On-Time Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    {analytics.onTimeRate}% of orders delivered on time
                  </p>
                </div>
                {analytics.onTimeRate < 80 && (
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                )}
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 text-xs font-medium bg-muted p-2">
                  <div>Order Type</div>
                  <div>Avg. Time</div>
                  <div>Target</div>
                </div>
                
                <div className="divide-y">
                  <div className="grid grid-cols-3 text-sm p-2">
                    <div>Standard Orders</div>
                    <div>{analytics.avgPrepTime} min</div>
                    <div className="text-muted-foreground">15-20 min</div>
                  </div>
                  <div className="grid grid-cols-3 text-sm p-2">
                    <div>Rush Orders</div>
                    <div>{Math.max(8, Math.round(analytics.avgPrepTime * 0.7))} min</div>
                    <div className="text-muted-foreground">10-15 min</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
