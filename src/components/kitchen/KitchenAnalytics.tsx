
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import type { KitchenOrder } from "@/types/staff";

interface KitchenAnalyticsProps {
  orders: KitchenOrder[];
}

export function KitchenAnalytics({ orders }: KitchenAnalyticsProps) {
  // Calculate metrics
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const preparingOrders = orders.filter(o => o.status === 'preparing').length;
  const readyOrders = orders.filter(o => o.status === 'ready').length;
  
  // Calculate average preparation time (in minutes)
  const prepTimes = orders
    .filter(o => o.status === 'delivered' && o.items.some(i => i.completion_time && i.start_time))
    .flatMap(o => 
      o.items
        .filter(i => i.completion_time && i.start_time)
        .map(i => {
          const start = new Date(i.start_time!).getTime();
          const end = new Date(i.completion_time!).getTime();
          return (end - start) / (1000 * 60); // Convert to minutes
        })
    );
  
  const avgPrepTime = prepTimes.length > 0 
    ? prepTimes.reduce((sum, time) => sum + time, 0) / prepTimes.length
    : 0;
  
  // Order status distribution for pie chart
  const statusData = [
    { name: 'Pending', value: pendingOrders },
    { name: 'Preparing', value: preparingOrders },
    { name: 'Ready', value: readyOrders },
    { name: 'Delivered', value: completedOrders }
  ];
  
  // Get top stations by usage
  const stationUsage = orders.flatMap(o => 
    o.items.map(i => i.cooking_station)
  ).reduce((acc, station) => {
    if (!station) return acc;
    acc[station] = (acc[station] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const stationData = Object.entries(stationUsage)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  
  // Dummy hourly order data for line chart
  const hourlyData = [
    { hour: '6 AM', orders: 2 },
    { hour: '8 AM', orders: 5 },
    { hour: '10 AM', orders: 8 },
    { hour: '12 PM', orders: 15 },
    { hour: '2 PM', orders: 12 },
    { hour: '4 PM', orders: 7 },
    { hour: '6 PM', orders: 18 },
    { hour: '8 PM', orders: 22 },
    { hour: '10 PM', orders: 14 }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {completedOrders} completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Average Prep Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgPrepTime.toFixed(1)} min</div>
            <p className="text-xs text-muted-foreground">
              Per menu item
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              {preparingOrders} in preparation
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Ready for Pickup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readyOrders}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting servers
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart
              data={statusData}
              index="name"
              categories={["value"]}
              colors={["blue"]}
              valueFormatter={(value) => `${value} orders`}
              className="aspect-square h-[200px]"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Station Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={stationData}
              index="name"
              categories={["value"]}
              colors={["green"]}
              valueFormatter={(value) => `${value} items`}
              className="aspect-square h-[200px]"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders by Hour</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            data={hourlyData}
            index="hour"
            categories={["orders"]}
            colors={["purple"]}
            valueFormatter={(value) => `${value} orders`}
            className="h-[200px]"
          />
        </CardContent>
      </Card>
    </div>
  );
}
